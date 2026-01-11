#include <benchmark/benchmark.h>
#include <atomic>
#include <thread>
#include <vector>

#include "CoarseUnboundedQueue.hpp"
#include "CoarseBoundedQueue.hpp"
#include "FineUnboundedQueue.hpp"
#include "FineBoundedQueue.hpp"

class QueueBenchmark : public benchmark::Fixture
{
public:
    void SetUp(const benchmark::State& state) override
    {
        producers = state.range(0);
        consumers = state.range(1);
        ops_per_thread = 100000;
    }
    
protected:
    int producers;
    int consumers;
    int ops_per_thread;
};

BENCHMARK_DEFINE_F(QueueBenchmark, FineUnboundedQueue)(benchmark::State& state)
{
    for (auto _ : state)
    {
        CoarseUnboundedQueue<int> queue;
        std::atomic<int> done = 0;
        std::atomic<bool> running = true;
        
        std::vector<std::thread> threads;
        
        for(int i = 0; i < producers; i++)
        {
            threads.emplace_back([&, i](){
                for(int j = 0; j < ops_per_thread; j++)
                {
                    queue.push(i * ops_per_thread + j);
                }
                done++;
            });
        }
        
        for(int i = 0; i < consumers; i++)
        {
            threads.emplace_back([&](){
                while(running || !queue.empty())
                {
                    int val;
                    queue.try_pop(val);
                }
            });
        }
        
        for(int i = 0; i < producers; i++) threads[i].join();
        running = false;
        for(int i = producers; i < producers + consumers; i++) threads[i].join();
    }
}

BENCHMARK_DEFINE_F(QueueBenchmark, CoarseUnboundedQueue)(benchmark::State& state)
{
    for (auto _ : state)
    {
        FineUnboundedQueue<int> queue;
        std::atomic<int> done = 0;
        std::atomic<bool> running = true;
        
        std::vector<std::thread> threads;
        
        for(int i = 0; i < producers; i++)
        {
            threads.emplace_back([&, i](){
                for(int j = 0; j < ops_per_thread; j++)
                {
                    queue.push(i * ops_per_thread + j);
                }
                done++;
            });
        }
        
        for(int i = 0; i < consumers; i++)
        {
            threads.emplace_back([&](){
                while(running || !queue.empty())
                {
                    int val;
                    queue.try_pop(val);
                }
            });
        }
        
        for(int i = 0; i < producers; i++) threads[i].join();
        running = false;
        for(int i = producers; i < producers + consumers; i++) threads[i].join();
    }
}

BENCHMARK_DEFINE_F(QueueBenchmark, FineBoundedQueue)(benchmark::State& state)
{
    for (auto _ : state)
    {
        CoarseBoundedQueue<int> queue(100);
        std::atomic<int> done = 0;
        std::atomic<bool> running = true;
        
        std::vector<std::thread> threads;
        
        for(int i = 0; i < producers; i++)
        {
            threads.emplace_back([&, i](){
                for(int j = 0; j < ops_per_thread; j++)
                {
                    queue.push(i * ops_per_thread + j);
                }
                done++;
            });
        }
        
        for(int i = 0; i < consumers; i++)
        {
            threads.emplace_back([&](){
                while(running || !queue.empty())
                {
                    int val;
                    queue.try_pop(val);
                }
            });
        }
        
        for(int i = 0; i < producers; i++) threads[i].join();
        running = false;
        for(int i = producers; i < producers + consumers; i++) threads[i].join();
    }
}

BENCHMARK_DEFINE_F(QueueBenchmark, CoarseBoundedQueue)(benchmark::State& state)
{
    for (auto _ : state)
    {
        FineBoundedQueue<int> queue(100);
        std::atomic<int> done = 0;
        std::atomic<bool> running = true;
        
        std::vector<std::thread> threads;
        
        for(int i = 0; i < producers; i++)
        {
            threads.emplace_back([&, i](){
                for(int j = 0; j < ops_per_thread; j++)
                {
                    queue.push(i * ops_per_thread + j);
                }
                done++;
            });
        }
        
        for(int i = 0; i < consumers; i++)
        {
            threads.emplace_back([&](){
                while(running || !queue.empty())
                {
                    int val;
                    queue.try_pop(val);
                }
            });
        }
        
        for(int i = 0; i < producers; i++) threads[i].join();
        running = false;
        for(int i = producers; i < producers + consumers; i++) threads[i].join();
    }
}

BENCHMARK_REGISTER_F(QueueBenchmark, FineUnboundedQueue)
    ->Args({1, 1})
    ->Args({2, 2})
    ->Args({4, 4})
    ->Args({1, 4})
    ->Args({4, 1})
    ->Iterations(10)
    ->Unit(benchmark::kMillisecond);

BENCHMARK_REGISTER_F(QueueBenchmark, CoarseUnboundedQueue)
    ->Args({1, 1})
    ->Args({2, 2})
    ->Args({4, 4})
    ->Args({1, 4})
    ->Args({4, 1})
    ->Iterations(10)
    ->Unit(benchmark::kMillisecond);

BENCHMARK_REGISTER_F(QueueBenchmark, FineBoundedQueue)
    ->Args({1, 1})
    ->Args({2, 2})
    ->Args({4, 4})
    ->Args({1, 4})
    ->Args({4, 1})
    ->Iterations(10)
    ->Unit(benchmark::kMillisecond);

BENCHMARK_REGISTER_F(QueueBenchmark, CoarseBoundedQueue)
    ->Args({1, 1})
    ->Args({2, 2})
    ->Args({4, 4})
    ->Args({1, 4})
    ->Args({4, 1})
    ->Iterations(10)
    ->Unit(benchmark::kMillisecond);

BENCHMARK_MAIN();