#include <atomic>
#include <mutex>
#include <condition_variable>
#include <vector>
#include <iostream>
#include <chrono>
#include <thread>
#include <queue>
#include <random>

template<typename T>
class CoarseUnboundedQueue {
public:
    void push(T value)
    {
        std::lock_guard<std::mutex> lock(_mutex);
        _queue.push(std::move(value));
        _cond.notify_one();
    }
    
    bool try_pop(T& value)
    {
        std::lock_guard<std::mutex> lock(_mutex);
        if (_queue.empty())
        {
            return false;
        }
        value = std::move(_queue.front());
        _queue.pop();
        return true;
    }
    
    void wait_pop(T& value)
    {
        std::unique_lock<std::mutex> lock(_mutex);
        _cond.wait(lock, [this] { return !_queue.empty(); });
        value = std::move(_queue.front());
        _queue.pop();
    }
    
    bool empty() const
    {
        std::lock_guard<std::mutex> lock(_mutex);
        return _queue.empty();
    }
private:
    std::queue<T> _queue;
    mutable std::mutex _mutex;
    std::condition_variable _cond;
};