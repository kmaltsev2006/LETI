cmake_minimum_required(VERSION 3.20.0)

project(task_parallel_merge_sort)

set(CMAKE_CXX_STANDART 20)
set(CMAKE_CXX_REQUIRED True)

add_executable(${PROJECT_NAME} main.cpp)

target_include_directories(${PROJECT_NAME} PRIVATE boost_1_89_0)