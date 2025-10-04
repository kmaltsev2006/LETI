#pragma once

#include <random>

#include "Matrix.hpp"

class MatrixGenerator
{
public:
    MatrixGenerator()
        : _rd()
        , _gen(_rd())
        , _dis()
    {}

    ~MatrixGenerator() = default;

    template<typename T>
    Matrix<T> gen(int rows, int cols, const std::pair<T, T>& interval)
    {
        setDistribution(interval);

        Matrix<T> m(rows, cols);
        for (int i = 0; i < rows; ++i)
        {
            for (int j = 0; j < cols; ++j)
            {
                m(i, j) = _dis(_gen);
            }
        }
        return m;
    }

private:
    std::random_device _rd;
    std::mt19937 _gen;
    std::uniform_real_distribution<> _dis;

private:
    template<typename T>
    void setDistribution(const std::pair<T, T>& interval) {
        _dis = std::uniform_real_distribution<> (
            std::min(interval.first, interval.second),
            std::max(interval.first, interval.second)
        );
    }
};