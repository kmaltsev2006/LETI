#pragma once

#include <vector>
#include <random>
#include <algorithm>

class GenVec
{
public:
    GenVec()
        : _rd()
        , _gen(_rd())
        , _dis(-10000, 10000)
    {}

    std::vector<int> operator()(size_t size)
    {
        std::vector<int> v(size);
        std::generate(v.begin(), v.end(), [this](){return _dis(_gen);});
        return v;
    }
private:
    std::random_device _rd;
    std::mt19937 _gen;
    std::uniform_int_distribution<> _dis;
};