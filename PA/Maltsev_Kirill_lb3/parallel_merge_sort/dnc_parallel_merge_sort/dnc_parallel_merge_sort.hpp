#pragma once

#include <vector>
#include <thread>
#include <atomic>
#include <mutex>

namespace DnCp
{

std::mutex mutex;
int available            = std::thread::hardware_concurrency();
const int THREADS_TO_GEN = 2;

template<typename T>
void merge(T *v, int l, int m, int r)
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
}



template<typename T>
void mergeSort(T *v, int l, int r)
{
    if (l >= r) return;
    int m = (l + r) / 2;

    mutex.lock();
    bool use_new_threads = (available >= THREADS_TO_GEN) && (r - l > 1024);
    if (use_new_threads) available -= THREADS_TO_GEN;
    mutex.unlock();

    if (use_new_threads) {
        std::thread t1([v, l, m](){mergeSort(v, l, m);});
        std::thread t2([v, m, r](){mergeSort(v, m + 1, r);});
        
        t1.join();
        t2.join();
        
        mutex.lock();
        available += THREADS_TO_GEN;
        mutex.unlock();

    } else {
        mergeSort(v, l, m);
        mergeSort(v, m + 1, r);
    }
    
    merge(v, l, m, r);
}

} // namespace DnCp


template<typename T>
void dncParallelMergeSort(std::vector<T>& v)
{
    DnCp::mergeSort(v.data(), 0, v.size() - 1);
}