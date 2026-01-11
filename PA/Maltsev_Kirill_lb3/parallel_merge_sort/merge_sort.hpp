#include <vector>
#include <random>
#include <algorithm>
#include <iostream>
#include <chrono>

template<typename T>
void merge(T *v, int l, int m, int r)
{
    int L_n = m - l + 1;
    int R_n = r - m;

    T *L = new T[L_n];
    T *R = new T[R_n];

    for (int i = 0; i < L_n; ++i) L[i] = v[l + i];
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
void _mergeSort(T *v, int l, int r)
{
    if (l >= r) return;

    int m = (l + r) / 2;
    _mergeSort(v, l, m);
    _mergeSort(v, m + 1, r);
    merge(v, l, m, r);
}

template<typename T>
void mergeSort(std::vector<T>& v)
{
    _mergeSort(v.data(), 0, v.size() - 1);
}