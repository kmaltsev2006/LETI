#pragma once

#include <string>
#include <fmt/base.h>
#include <fmt/os.h>

class Logger
{
public:
    template<typename... Args>
    static void info(fmt::v11::ostream& file, const std::string& fmt, Args&&... args)
    {
        file.print(fmt, args...);
    }
};