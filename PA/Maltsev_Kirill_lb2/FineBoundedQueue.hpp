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
class FineBoundedQueue
{   
public:
    FineBoundedQueue(size_t size) : _capacity(size)
    {
        _buffer.resize(_capacity);
    }
    
    bool try_push(T value)
    {
        std::unique_lock<std::mutex> tail_lock(_tail_mutex);
        if (_cnt == _capacity)
        {
            return false;
        }
        
        _buffer[_tail] = std::move(value);
        _tail = (_tail + 1) % _capacity;
        
        {
            std::lock_guard<std::mutex> head_lock(_head_mutex);
            ++_cnt;
        }
        
        _not_empty.notify_one();
        return true;
    }
    
    void push(T value)
    {
        std::unique_lock<std::mutex> tail_lock(_tail_mutex);
        _not_full.wait(tail_lock, [this] { 
            std::lock_guard<std::mutex> head_lock(_head_mutex);
            return _cnt < _capacity; 
        });
        
        _buffer[_tail] = std::move(value);
        _tail = (_tail + 1) % _capacity;
        
        {
            std::lock_guard<std::mutex> head_lock(_head_mutex);
            ++_cnt;
        }
        
        _not_empty.notify_one();
    }
    
    bool try_pop(T& value)
    {
        std::unique_lock<std::mutex> head_lock(_head_mutex);
        if (_cnt == 0)
        {
            return false;
        }
        
        value = std::move(_buffer[_head]);
        _head = (_head + 1) % _capacity;
        --_cnt;
        
        _not_full.notify_one();
        return true;
    }
    
    void pop(T& value)
    {
        std::unique_lock<std::mutex> head_lock(_head_mutex);
        _not_empty.wait(head_lock, [this] { return _cnt > 0; });
        
        value = std::move(_buffer[_head]);
        _head = (_head + 1) % _capacity;
        --_cnt;
        
        _not_full.notify_one();
    }
    
    bool empty() const {
        std::lock_guard<std::mutex> head_lock(_head_mutex);
        return _cnt == 0;
    }
    
    bool full() const {
        std::lock_guard<std::mutex> head_lock(_head_mutex);
        return _cnt == _capacity;
    }

private:
    std::vector<T> _buffer;
    size_t _capacity;
    size_t _head = 0;
    size_t _tail = 0;
    size_t _cnt = 0;
    
    mutable std::mutex _head_mutex;
    mutable std::mutex _tail_mutex;
    std::condition_variable _not_empty;
    std::condition_variable _not_full;
};