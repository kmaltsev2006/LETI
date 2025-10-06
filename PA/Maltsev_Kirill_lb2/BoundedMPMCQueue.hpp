#pragma once

#include <cstdint>
#include <stdexcept>
template<typename T>
class BoundedMPMCQueue
{
public:
    struct Node
    {
        T val;
        Node *next;
    };

public:
    explicit BoundedMPMCQueue(uint32_t max_size=0)
        : _size(0)
        , _max_size(max_size)
        , _fiction(new Node)
        , _front(_fiction)
        , _back(_fiction)
    {}

    ~BoundedMPMCQueue()
    {
        delete _fiction;
    }

    bool empty()
    {
        return (_front == _back);
    }

    void enqueue(T val)
    {
        Node *node = new Node{val, _back->next};
        _back->next = node;
    }

    void dequeue()
    {
        if (empty()) return;
        // TODO
    }

private:
    uint32_t _size;
    uint32_t _max_size;
    Node *_fiction;
    Node *_front;
    Node *_back;
};