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
class CoarseBoundedQueue
{
public:
    CoarseBoundedQueue(size_t size) : _cap(size) {}
    
    bool try_push(T value)
    {
        std::lock_guard<std::mutex> lock(_mutex);
        if (_q.size() >= _cap)
        {
            return false;
        }
        _q.push(std::move(value));
        _not_empty.notify_one();
        return true;
    }
    
    void push(T value)
    {
        std::unique_lock<std::mutex> lock(_mutex);
        _not_full.wait(lock, [this] { return _q.size() < _cap; });
        _q.push(std::move(value));
        _not_empty.notify_one();
    }
    
    bool try_pop(T& value)
    {
        std::lock_guard<std::mutex> lock(_mutex);
        if (_q.empty()) {
            return false;
        }
        value = std::move(_q.front());
        _q.pop();
        _not_full.notify_one();
        return true;
    }
    
    void pop(T& value)
    {
        std::unique_lock<std::mutex> lock(_mutex);
        _not_empty.wait(lock, [this] { return !_q.empty(); });
        value = std::move(_q.front());
        _q.pop();
        _not_full.notify_one();
    }
    
    bool empty() const
    {
        std::lock_guard<std::mutex> lock(_mutex);
        return _q.empty();
    }
    
    bool full() const
    {
        std::lock_guard<std::mutex> lock(_mutex);
        return _q.size() >= _cap;
    }
private:
    std::queue<T> _q;
    size_t _cap;
    mutable std::mutex _mutex;
    std::condition_variable _not_empty;
    std::condition_variable _not_full;
};