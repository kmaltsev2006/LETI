#include <memory>
#include <mutex>
#include <condition_variable>

template<typename T>
class FineUnboundedQueue
{
private:
    struct Node
    {
        std::shared_ptr<T> data;
        std::unique_ptr<Node> next;
    };

    std::unique_ptr<Node> head;
    Node *tail;
    std::mutex head_mutex;
    std::mutex tail_mutex;
    std::condition_variable data_cond;

    Node *get_tail()
    {
        std::lock_guard<std::mutex> lock(tail_mutex);
        return tail;
    }

    std::unique_ptr<Node> pop_head()
    {
        std::unique_ptr<Node> old_head = std::move(head);
        head = std::move(old_head->next);
        return old_head;
    }

public:
    FineUnboundedQueue() :
        head(std::make_unique<Node>()), tail(head.get()) {}

    void push(T value) {
        auto new_data = std::make_shared<T>(std::move(value));
        auto new_node = std::make_unique<Node>();
        Node *const new_tail = new_node.get();

        {
            std::lock_guard<std::mutex> lock(tail_mutex);
            tail->data = std::move(new_data);
            tail->next = std::move(new_node);
            tail = new_tail;
        }
        data_cond.notify_one();
    }

    bool try_pop(T& value)
    {
        std::lock_guard<std::mutex> lock(head_mutex);
        if (head.get() == get_tail()) {
            return false;
        }
        value = std::move(*head->data);
        pop_head();
        return true;
    }

    void wait_pop(T& value)
    {
        std::unique_lock<std::mutex> lock(head_mutex);
        data_cond.wait(lock, [this] {
            return head.get() != get_tail();
        });
        value = std::move(*head->data);
        pop_head();
    }

    bool empty()
    {
        std::lock_guard<std::mutex> lock(head_mutex);
        return head.get() == get_tail();
    }
};
