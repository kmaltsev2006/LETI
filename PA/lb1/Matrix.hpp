#pragma once

#include <vector>
#include <cstdint>

template<typename value_t>
class Matrix
{
public:
    explicit Matrix(int rows, int cols)
        : rows(rows)
        , cols(cols)
    {
        _data.assign(rows, std::vector<value_t>(cols, 0.0));
    }

    explicit Matrix(const std::vector<std::vector<value_t>>&& data)
        : _data(data)
        , rows(data.size())
        , cols(data[0].size())
    {} // TODO: add validator for empty data

    ~Matrix() = default;

    value_t& operator()(int i, int j)
    {
        return _data[i][j];
    }

public:
    int cols;
    int rows;

private:
    std::vector<std::vector<value_t>> _data;
};