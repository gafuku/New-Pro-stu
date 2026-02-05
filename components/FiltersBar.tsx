import { campuses, gradeLevels, schools, topics, resourceTypes } from "@/lib/constants";


type Filters = {
  topic: string;
  resourceType: string;
  school: string;
  campus: string;
  gradeLevel: string;
  tags: string;
};

interface Props {
  filters: Filters;
  setFilters: (filters: Partial<Filters>) => void;
  search: string;
  setSearch: (value: string) => void;
}

export default function FiltersBar({ setFilters, search, setSearch, filters }: Props) {
  const handleChange = (updates: Partial<Filters>) => {
    setFilters(updates);
  };

  return (
    <div className="panel">
      <div className="kv">
        <input
          className="input"
          placeholder="Search titles or content"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select"
          value={filters.topic}
          onChange={(e) => handleChange({ topic: e.target.value })}
        >
          <option value="">All topics</option>
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          className="select"
          value={filters.resourceType}
          onChange={(e) => handleChange({ resourceType: e.target.value })}
        >
          <option value="">All types</option>
          {resourceTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          className="select"
          value={filters.school}
          onChange={(e) => handleChange({ school: e.target.value })}
        >
          <option value="">All schools</option>
          {schools.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          className="select"
          value={filters.campus}
          onChange={(e) => handleChange({ campus: e.target.value })}
        >
          <option value="">All campuses</option>
          {campuses.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="select"
          value={filters.gradeLevel}
          onChange={(e) => handleChange({ gradeLevel: e.target.value })}
        >
          <option value="">All grade levels</option>
          {gradeLevels.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <input
          className="input"
          placeholder="Tags (comma-separated)"
          value={filters.tags}
          onChange={(e) => handleChange({ tags: e.target.value })}
        />
      </div>
    </div>
  );
}
