import json
import matplotlib.pyplot as plt
import re


def load_data(filepath='../benchmark.json'):
    with open(filepath, 'r') as f:
        data = json.load(f)
    return data


def parse_benchmarks(data, categories):
    results = {cat: {"x": [], "y": []} for cat in categories}
    for benchmark in data["benchmarks"]:
        name = benchmark["name"]
        if len(name.split('/')) > 1:
            cat = name.split('/')[1]
            if cat in categories:
                match = re.search(rf"{cat}/(\d+)", name)
                if match:
                    x_value = int(match.group(1))
                    y_value = benchmark["real_time"]
                    results[cat]["x"].append(x_value)
                    results[cat]["y"].append(y_value)
    return results


def plot_real_time(results, categories):
    plt.figure(figsize=(12, 8))
    for cat in categories:
        plt.plot(results[cat]["x"], results[cat]["y"], marker='o', label=cat)
    plt.title('real_time vs parameter')
    plt.xlabel('Parameter (e.g., matrix size)')
    plt.ylabel('real_time (ms)')
    all_x_values = sorted(set(x for cat in categories for x in results[cat]["x"]))
    plt.xticks(all_x_values)
    plt.legend()
    plt.grid(True)
    plt.show()


def compute_speedup_efficiency(results, base_cat="Multiply", multi_cat="MultiplyConcurrently", max_param=1024, num_threads=8):
    single_thread = {x: y for x, y in zip(results[base_cat]["x"], results[base_cat]["y"]) if x <= max_param}
    x_vals, speedups, efficiencies = [], [], []
    for x, y in zip(results[multi_cat]["x"], results[multi_cat]["y"]):
        if x <= max_param and x in single_thread:
            speedup = single_thread[x] / y
            efficiency = speedup / num_threads
            x_vals.append(x)
            speedups.append(speedup)
            efficiencies.append(efficiency)
    return x_vals, speedups, efficiencies


def plot_speedup_efficiency(x_vals, speedups, efficiencies, title):
    plt.figure(figsize=(12, 6))
    plt.plot(x_vals, speedups, marker='o', label='speedup')
    plt.plot(x_vals, efficiencies, marker='x', label='efficiency')

    for (x, s, e) in zip(x_vals, speedups, efficiencies):
        plt.text(x, s, f"{s:.2f}", fontsize=9, ha='left', va='bottom')
        plt.text(x, e, f"{e:.2f}", fontsize=9, ha='left', va='top')

    plt.title(title)
    plt.xlabel('Parameter (e.g., matrix size)')
    plt.ylabel('Value')
    plt.xticks(x_vals)
    plt.legend()
    plt.grid(True)
    plt.show()


def main():
    categories = ["Multiply", "MultiplyConcurrently", "MultiplyAsync"]
    data = load_data()
    results = parse_benchmarks(data, categories)

    plot_real_time(results, categories)

    for multi_cat in ["MultiplyConcurrently", "MultiplyAsync"]:
        x_vals, speedups, efficiencies = compute_speedup_efficiency(results, multi_cat=multi_cat)
        plot_speedup_efficiency(x_vals, speedups, efficiencies, f'Speedup and Efficiency for {multi_cat} (param ≤ 1024)')


if __name__ == '__main__':
    main()
