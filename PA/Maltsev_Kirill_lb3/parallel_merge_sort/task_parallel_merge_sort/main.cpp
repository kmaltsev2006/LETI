#include <vector>
#include <algorithm>
#include <iostream>

#include "task_parallel_merge_sort.hpp"
#include "../GenVec.hpp"

int main()
{
    GenVec gen_vec;
    std::vector<int> a = gen_vec(100);
    taskParallelMergeSort(a);
    std::cout << std::is_sorted(a.begin(), a.end()) << std::endl;
}