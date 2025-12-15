#include <vector>
#include <algorithm>
#include <iostream>

#include "dnc_parallel_merge_sort.hpp"
#include "../GenVec.hpp"

int main()
{
    GenVec gen_vec;
    std::vector<int> a = gen_vec(10000000);
    dncParallelMergeSort(a);
    std::cout << std::is_sorted(a.begin(), a.end()) << std::endl;
}