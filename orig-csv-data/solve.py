split = lambda x: x.split(',')
csv = lambda file: map(split, open(file).read().strip().split('\n'))

id_lookup = {id: navn for navn, id in csv('by_id.csv')}
per_by = {navn: 0 for navn in id_lookup.values()}

for egg, by, nisse in list(csv('egg_by.csv'))[1:]:
	per_by[id_lookup[by]] += int(egg)

print(*max(per_by.items(), key=lambda x: x[1]))