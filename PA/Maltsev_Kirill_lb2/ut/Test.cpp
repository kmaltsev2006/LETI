#include <gtest/gtest.h>
#include <atomic>
#include <thread>
#include <vector>

#include "FineUnboundedQueue.hpp"
#include "CoarseUnboundedQueue.hpp"
#include "FineBoundedQueue.hpp"
#include "CoarseBoundedQueue.hpp"

TEST(FineUnboundedQueue, Test1)
{
    FineUnboundedQueue<int> queue;
    std::atomic<int> pushed = 0;
    std::atomic<int> popped = 0;
    std::atomic<bool> running = true;
    
    std::thread t1([&](){
        for(int i = 0; i < 10000; i++){
            queue.push(i);
            pushed += i;
        }
    });
    
    std::thread t2([&](){
        for(int i = 0; i < 10000; i++){
            queue.push(i);
            pushed += i;
        }
    });
    
    std::thread t3([&](){
        while(running || !queue.empty()){
            int val;
            if(queue.try_pop(val)){
                popped += val;
            }
        }
    });
    
    t1.join();
    t2.join();
    running = false;
    t3.join();
    
    int val;
    while(queue.try_pop(val)){
        popped += val;
    }
    
    EXPECT_EQ(pushed, popped);
}

TEST(CoarseUnboundedQueue, Test1)
{
    CoarseUnboundedQueue<int> queue;
    std::atomic<int> pushed = 0;
    std::atomic<int> popped = 0;
    std::atomic<bool> running = true;
    
    std::thread t1([&](){
        for(int i = 0; i < 10000; i++){
            queue.push(i);
            pushed += i;
        }
    });
    
    std::thread t2([&](){
        for(int i = 0; i < 10000; i++){
            queue.push(i);
            pushed += i;
        }
    });
    
    std::thread t3([&](){
        while(running || !queue.empty()){
            int val;
            if(queue.try_pop(val)){
                popped += val;
            }
        }
    });
    
    t1.join();
    t2.join();
    running = false;
    t3.join();
    
    int val;
    while(queue.try_pop(val)){
        popped += val;
    }
    
    EXPECT_EQ(pushed, popped);
}

TEST(FineBoundedQueue, Test1)
{
    FineBoundedQueue<int> queue(100);
    std::atomic<int> pushed = 0;
    std::atomic<int> popped = 0;
    std::atomic<bool> running = true;
    
    std::thread t1([&](){
        for(int i = 0; i < 10000; i++){
            queue.push(i);
            pushed += i;
        }
    });
    
    std::thread t2([&](){
        for(int i = 0; i < 10000; i++){
            queue.push(i);
            pushed += i;
        }
    });
    
    std::thread t3([&](){
        while(running || !queue.empty()){
            int val;
            if(queue.try_pop(val)){
                popped += val;
            }
        }
    });
    
    t1.join();
    t2.join();
    running = false;
    t3.join();
    
    int val;
    while(queue.try_pop(val)){
        popped += val;
    }
    
    EXPECT_EQ(pushed, popped);
}

TEST(CoarseBoundedQueue, Test1)
{
    CoarseBoundedQueue<int> queue(100);
    std::atomic<int> pushed = 0;
    std::atomic<int> popped = 0;
    std::atomic<bool> running = true;
    
    std::thread t1([&](){
        for(int i = 0; i < 10000; i++){
            queue.push(i);
            pushed += i;
        }
    });
    
    std::thread t2([&](){
        for(int i = 0; i < 10000; i++){
            queue.push(i);
            pushed += i;
        }
    });
    
    std::thread t3([&](){
        while(running || !queue.empty()){
            int val;
            if(queue.try_pop(val)){
                popped += val;
            }
        }
    });
    
    t1.join();
    t2.join();
    running = false;
    t3.join();
    
    int val;
    while(queue.try_pop(val)){
        popped += val;
    }
    
    EXPECT_EQ(pushed, popped);
}

int main(int argc, char **argv)
{
    testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}