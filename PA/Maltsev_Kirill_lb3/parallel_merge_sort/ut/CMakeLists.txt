cmake_minimum_required(VERSION 3.20)

project(TestParallelMergeSort)

set(CMAKE_CXX_STANDART 20)
set(CMAKE_CXX_REQUIRED True)

add_subdirectory(googletest)
add_executable(${PROJECT_NAME} TestParallelMergeSort.cpp)

target_include_directories(${PROJECT_NAME} PRIVATE 
    googletest/googletest/include
    ../task_parallel_merge_sort/boost_1_89_0
    ../DnC_parallel_merge_sort
    ../task_parallel_merge_sort
    ../)

target_link_libraries(${PROJECT_NAME} gtest)