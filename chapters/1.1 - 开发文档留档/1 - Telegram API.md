# 隐藏

## Telegram Bot API

> The Bot API is an HTTP-based interface created for developers keen on building bots for Telegram.
>
> To learn how to create and set up a bot, please consult our Introduction to Bots and Bot FAQ.

### Authorizing your bot

Each bot is given a unique authentication token when it is created. The token looks something like `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`, but we'll use simply **\<token\>** in this document instead. You can learn about obtaining tokens and generating new ones in this document.

### Making requests

All queries to the Telegram Bot API must be served over HTTPS and need to be presented in this form: `https://api.telegram.org/bot<token>/METHOD_NAME`. Like this for example:

```
https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/getMe
```

We support **GET** and POST **HTTP** methods. We support four ways of passing parameters in Bot API requests:

- URL query string
- application/x-www-form-urlencoded
- application/json (except for uploading files)
- multipart/form-data (use to upload files)

The response contains a JSON object, which always has a Boolean field 'ok' and may have an optional String field 'description' with a human-readable description of the result. If 'ok' equals True, the request was successful and the result of the query can be found in the 'result' field. In case of an unsuccessful request, 'ok' equals false and the error is explained in the 'description'. An Integer 'error_code' field is also returned, but its contents are subject to change in the future. Some errors may also have an optional field 'parameters' of the type ResponseParameters, which can help to automatically handle the error.

- All methods in the Bot API are case-insensitive.
- All queries must be made using UTF-8.

#### Making requests when getting updates

If you're using **webhooks**, you can perform a request to the Bot API while sending an answer to the webhook. Use either application/json or application/x-www-form-urlencoded or multipart/form-data response content type for passing parameters. Specify the method to be invoked in the method parameter of the request. It's not possible to know that such a request was successful or get its result.

> Please see our FAQ for examples.

### Using a Local Bot API Server

The Bot API server source code is available at telegram-bot-api. You can run it locally and send the requests to your own server instead of `https://api.telegram.org`. If you switch to a local Bot API server, your bot will be able to:

- Download files without a size limit.
- Upload files up to 2000 MB.
- Upload files using their local path and the file URI scheme.
- Use an HTTP URL for the webhook.
- Use any local IP address for the webhook.
- Use any port for the webhook.
- Set max_webhook_connections up to 100000.
- Receive the absolute local path as a value of the file_path field without the need to download the file after a getFile request.

#### Do I need a Local Bot API Server

The majority of bots will be OK with the default configuration, running on our servers. But if you feel that you need one of these features, you're welcome to switch to your own at any time.

### Getting updates

There are two mutually exclusive ways of receiving updates for your bot — the getUpdates method on one hand and Webhooks on the other. Incoming updates are stored on the server until the bot receives them either way, but they will not be kept longer than 24 hours.

Regardless of which option you choose, you will receive JSON-serialized Update objects as a result.

#### Update

This object represents an incoming update.
At most **one** of the optional parameters can be present in any given update.

|Field	|Type	|Description|
| :--- | :--- | :--- |
|update_id	|Integer	|The update's unique identifier. Update identifiers start from a certain positive number and increase sequentially. This ID becomes especially handy if you're using Webhooks, since it allows you to ignore repeated updates or to restore the correct update sequence, should they get out of order. If there are no new updates for at least a week, then identifier of the next update will be chosen randomly instead of sequentially.|
|message	|Message	|Optional. New incoming message of any kind — text, photo, sticker, etc.|
|edited_message	|Message	|Optional. New version of a message that is known to the bot and was edited|
|channel_post	|Message	|Optional. New incoming channel post of any kind — text, photo, sticker, etc.|
|edited_channel_post	|Message	|Optional. New version of a channel post that is known to the bot and was edited|
|inline_query	|InlineQuery	|Optional. New incoming inline query|
|chosen_inline_result	|ChosenInlineResult	|Optional. The result of an inline query that was chosen by a user and sent to their chat partner. Please see our documentation on the feedback collecting for details on how to enable these updates for your bot.|
|callback_query	|CallbackQuery	|Optional. New incoming callback query|
|shipping_query	|ShippingQuery	|Optional. New incoming shipping query. Only for invoices with flexible price|
|pre_checkout_query	|PreCheckoutQuery	|Optional. New incoming pre-checkout query. Contains full information about checkout|
|poll	|Poll	|Optional. New poll state. Bots receive only updates about stopped polls and polls, which are sent by the bot|
|poll_answer	|PollAnswer	|Optional. A user changed their answer in a non-anonymous poll. Bots receive new votes only in polls that were sent by the bot itself.|
|my_chat_member	|ChatMemberUpdated	|Optional. The bot's chat member status was updated in a chat. For private chats, this update is received only when the bot is blocked or unblocked by the user.|
|chat_member	|ChatMemberUpdated	|Optional. A chat member's status was updated in a chat. The bot must be an administrator in the chat and must explicitly specify “chat_member” in the list of allowed_updates to receive these updates.|
|chat_join_request	|ChatJoinRequest	|Optional. A request to join the chat has been sent. The bot must have the can_invite_users administrator right in the chat to receive these updates.|

#### getUpdates

Use this method to receive incoming updates using long polling (wiki). An Array of Update objects is returned.

|Parameter	|Type	|Required	|Description|
| :--- | :--- | :--- | :--- |
|offset	|Integer	|Optional	|Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned. An update is considered confirmed as soon as getUpdates is called with an offset higher than its update_id. The negative offset can be specified to retrieve updates starting from -offset update from the end of the updates queue. All previous updates will forgotten.|
|limit	|Integer	|Optional	|Limits the number of updates to be retrieved. Values between 1-100 are accepted. Defaults to 100.|
|timeout	|Integer	|Optional	|Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling. Should be positive, short polling should be used for testing purposes only.|
|allowed_updates	|Array of String	|Optional	|A JSON-serialized list of the update types you want your bot to receive. For example, specify [“message”, “edited_channel_post”, “callback_query”] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all update types except chat_member (default). If not specified, the previous setting will be used.<br/><br/>Please note that this parameter doesn't affect updates created before the call to the getUpdates, so unwanted updates may be received for a short period of time.|

> **Notes**
>
> **1.** This method will not work if an outgoing webhook is set up.
>
> **2.** In order to avoid getting duplicate updates, recalculate offset after each server response.

#### setWebhook

Use this method to specify a url and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified url, containing a JSON-serialized Update. In case of an unsuccessful request, we will give up after a reasonable amount of attempts. Returns True on success.

If you'd like to make sure that the Webhook request comes from Telegram, we recommend using a secret path in the URL, e.g. `https://www.example.com/<token>`. Since nobody else knows your bot's token, you can be pretty sure it's us.