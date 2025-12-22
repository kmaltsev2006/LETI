import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('benchmark.csv')
df_44 = df[df['name'].str.contains('/4/4')]

test_names = ['FineUnboundedQueue', 'CoarseUnboundedQueue', 
              'FineBoundedQueue', 'CoarseBoundedQueue']
times = []

for name in test_names:
    row = df_44[df_44['name'].str.contains(name)]
    times.append(float(row['real_time']))

plt.bar(test_names, times)
plt.title('Benchmark Results (4 producers / 4 consumers)')
plt.ylabel('Time (ms)')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()