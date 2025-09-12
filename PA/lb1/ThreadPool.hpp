#pragma once

#include <vector>
#include <queue>
#include <functional>
#include <thread>
#include <mutex>
#include <condition_variable>

#include "Task.hpp"

class ThreadPool
{
public:
    ThreadPool(int workers_count)
        : _stop(false)
    {
        for (int i = 0; i < workers_count; ++i)
        {
            _workers.emplace_back([this](){
                workerRoutine();
            });
        }
    }

    ~ThreadPool()
    {
        _stop = true;
        _cv.notify_all();
        for (auto& worker: _workers)
        {
            worker.join();
        }
    }

    void enqueue(Task task)
    {
        std::unique_lock lock(_mutex);
        _tasks.push(std::move(task));
        _cv.notify_one();
    }

private:
    std::vector<std::thread> _workers;
    std::queue<Task> _tasks;
    std::mutex _mutex;
    std::condition_variable _cv;
    bool _stop;

private:
    void workerRoutine()
    {
        while (true)
        {
            std::unique_lock lock(_mutex);
            _cv.wait(lock, [this](){ return _stop || !_tasks.empty(); });
            if (_stop && _tasks.empty())
            {
                return;
            }
            auto task = std::move(_tasks.front());
            _tasks.pop();
            lock.unlock();
            task();
        }
    }
    
};