cmake_minimum_required(VERSION 3.20)

project(Test)

set(CMAKE_CXX_STANDART 20)
set(CMAKE_CXX_REQUIRED True)

add_subdirectory(googletest)
add_executable(${PROJECT_NAME} Test.cpp)

target_include_directories(${PROJECT_NAME} PRIVATE 
    googletest/googletest/include
    ../)

target_link_libraries(${PROJECT_NAME} gtest)