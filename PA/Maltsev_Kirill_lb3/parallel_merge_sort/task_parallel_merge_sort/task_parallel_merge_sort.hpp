#pragma once

#include <boost/asio/thread_pool.hpp>
#include <boost/asio/post.hpp>
#include <thread>
#include <memory>
#include <vector>

namespace tp
{

struct Node
{
    explicit Node(int l, int m, int r, std::shared_ptr<Node> p=nullptr, int cnt=0)
        : p(p), cnt(cnt), l(l), m(m), r(r)
    {}

    std::shared_ptr<Node> p; // parent
    std::atomic<int> cnt;    // number of descendants 
    int l;
    int m;
    int r;
};

template<typename T>
void merge(boost::asio::thread_pool& thread_pool, std::shared_ptr<Node> p, T *v, int l, int m, int r)
{
    int L_n = m - l + 1;
    int R_n = r - m;

    T *L { new T[L_n] };
    T *R { new T[R_n] };

    for (int i = 0; i < m-l+1; ++i) L[i] = v[l + i];
    for (int j = 0; j < R_n; ++j) R[j] = v[m + j + 1];

    int i = 0;
    int j = 0;
    int k = l;
    while (i < L_n && j < R_n) {
        if (L[i] < R[j]) v[k++] = L[i++];
        else v[k++] = R[j++];
    }

    while (i < L_n) v[k++] = L[i++];
    while (j < R_n) v[k++] = R[j++];

    delete[] L;
    delete[] R;

    if (p && (0 == --p->cnt))
    {
        boost::asio::post(thread_pool, [&thread_pool, p, v](){
            merge(thread_pool, p->p, v, p->l, p->m, p->r);
        });
    }
}

template<typename T>
void mergeSort(boost::asio::thread_pool& thread_pool, std::shared_ptr<Node> p, T *v, int l, int r)
{
    if (l - r <= 131072)
    {
        std::sort(v + l, v + r + 1);

        if (p && (0 == --p->cnt))
        {
            boost::asio::post(thread_pool, [&thread_pool, p, v](){
                merge(thread_pool, p->p, v, p->l, p->m, p->r);
            });
        }
        return;
    }

    int m = (l + r) / 2;

    std::shared_ptr<Node> node = std::make_shared<Node>(l, m, r, p, /*cnt: */ 2);
    
    boost::asio::post(thread_pool, [&thread_pool, node, v, l, m](){
        mergeSort(thread_pool, node, v, l, m);
    });
    boost::asio::post(thread_pool, [&thread_pool, node, v, m, r](){
        mergeSort(thread_pool, node, v, m + 1, r);
    });
}

} // namespace tp


template<typename T>
void taskParallelMergeSort(std::vector<T>& v)
{
    boost::asio::thread_pool thread_pool(std::thread::hardware_concurrency());
    boost::asio::post(thread_pool, [&](){
        tp::mergeSort(thread_pool, nullptr, v.data(), 0, v.size() - 1);
    });
    thread_pool.join();
}