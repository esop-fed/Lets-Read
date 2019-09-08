/**
 * 统一消息管理, 将消息发送给所有订阅这个消息类型的模块
 * 采用 订阅/发布(观察者) 这种设计模块式开发
 */
class MsgCenter {
    topicSubsMap = new Map();
    uuid = 0;

    _getUUID() {
        return ++this.uuid;
    }

    publish(topic, resultObj) {
        if (!this.topicSubsMap.has(topic)) {
            return false;
        }
        let subscribers = this.topicSubsMap.get(topic);
        subscribers.forEach((sub) => {
            sub.func(topic, resultObj);
        });
        return true;
    }

    /**
     * 订阅事件
     * @param topic string | array
     * @param func function(topic, event)
     * @param uuid
     * @returns {*|number}
     */
    subscribe(topic, func, uuid) {
        uuid = uuid || this._getUUID();
        if (Array.isArray(topic)) {
            topic.forEach((item) => {
                this.subscribe(item, func, uuid);
            });
            return uuid;
        }
        if (!this.topicSubsMap.has(topic)) {
            this.topicSubsMap.set(topic, []);
        }
        this.topicSubsMap.get(topic).push({
            token: uuid,
            func: func
        });
        return uuid;
    }

    unsubscribe(token) {
        for (let subs of this.topicSubsMap.values()) {
            for (let i = 0; i < subs.length; i++) {
                if (subs[i].token == token) {
                    subs.splice(i--, 1);
                }
            }
        }
        return false;
    }

    reset() {
        this.topicSubsMap.clear();
    }
}

export default new MsgCenter();
