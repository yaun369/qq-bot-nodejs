const service = require("./service");

const WHITE_LIST = ["HL", "黄历"];

module.exports = () => {
  return async ({ data, ws }) => {
    if (!data.message || !["group", "private"].includes(data.message_type)) {
      return;
    }
    const message = data.raw_message.toUpperCase().trim();
    if (!WHITE_LIST.includes(message)) {
      return;
    }

    if (data.message_type === "group") {
      ws.send("send_group_msg", {
        group_id: data.group_id,
        message: [
          {
            type: "reply",
            data: {
              id: data.message_id,
            },
          },
          ...(await service.getDetail()),
        ],
      });
      return;
    }

    if (data.message_type === "private") {
      ws.send("send_private_msg", {
        user_id: data.user_id,
        message: await service.getDetail(),
      });
      return;
    }
  };
};
