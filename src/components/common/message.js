import { Message as msg } from "element-ui";

// modify default config options
var opt = { showClose: true };

var Message = opts => {
    if (typeof opts === "string") {
        return msg({ message: opts, ...opt });
    }
    for (var key in opt) {
        opts[key] = opt[key];
    }
    return msg(opts);
};

["success", "warning", "info", "error"].forEach(type => {
    Message[type] = options => {
        if (typeof options === "string") {
            options = {
                message: options
            };
        }
        options.type = type;
        for (var key in opt) {
            options[key] = opt[key];
        }
        return msg(options);
    };
});

export default Message;
