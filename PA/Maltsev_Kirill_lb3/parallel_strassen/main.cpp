#include <iostream>
#include <utility>

#include "MatrixGenerator.hpp"
#include "MatrixMultiplier.hpp"

int main()
{
    MatrixGenerator matrix_generator;

    int n, p, m;
    std::cout << "Input n, p, m: ";
    std::cin >> n >> p >> m;

    auto a = matrix_generator.gen(n, p, std::make_pair(-100.0, 100.0));
    auto b = matrix_generator.gen(p, m, std::make_pair(-100.0, 100.0));
    auto c = multiplyConcurrently(a, b, std::thread::hardware_concurrency());
}
