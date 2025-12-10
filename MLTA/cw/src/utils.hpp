#pragma once

namespace mlta
{

template<typename T>
T mod(T a, T b)
{
    return (a % b + b) % b;
}

} // namespace mlta
