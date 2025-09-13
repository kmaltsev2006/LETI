#pragma once

#include <vector>
#include <cstdint>
#include <stdexcept>


template<typename T>
class Matrix
{
public:
    explicit Matrix(int rows, int cols)
        : rows(rows)
        , cols(cols)
    {
        _data.assign(rows, std::vector<T>(cols, static_cast<T>(0)));
    }

    explicit Matrix(const std::vector<std::vector<T>>& data)
    {
        validate(data);
        _data = data;
        rows = data.size();
        cols = data[0].size();
    }

    ~Matrix() = default;

    T& operator()(int i, int j)
    {
        return _data[i][j];
    }
    
    T operator()(int i, int j) const
    {
        return _data[i][j];
    }

public:
    int cols;
    int rows;

private:
    std::vector<std::vector<T>> _data;

private:
    void validate(const std::vector<std::vector<T>>& data)
    {
        if (0 == data.size())
        {
            throw std::invalid_argument("Matrix cannot be empty");
        }

        if (0 == data[0].size())
        {
            throw std::invalid_argument("Matrix cannot be empty");
        }

        for (auto& row : data)
        {
            if (row.size() != data[0].size())
            {
                throw std::invalid_argument("Matrix cannot be jagged");
            }
        }
    }
};