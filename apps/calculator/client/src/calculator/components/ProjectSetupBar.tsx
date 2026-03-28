import { calculatorVersions, type CalculatorVersionId } from "@/calculator/registry";

type ProjectSetupBarProps = {
  version: CalculatorVersionId;
  onVersionChange: (value: CalculatorVersionId) => void;
  projectCategory: string;
  onProjectCategoryChange: (value: string) => void;
  projectType: string;
  onProjectTypeChange: (value: string) => void;
};

export function ProjectSetupBar({
  version,
  onVersionChange,
  projectCategory,
  onProjectCategoryChange,
  projectType,
  onProjectTypeChange,
}: ProjectSetupBarProps) {
  const selectedVersion = calculatorVersions[version];

  const categories = selectedVersion.criteria.projectCategories ?? [];
  const allProjectTypes = selectedVersion.criteria.projectTypes ?? [];

  const filteredProjectTypes = projectCategory
    ? allProjectTypes.filter((type) => type.category === projectCategory)
    : allProjectTypes;

  const showProjectControls = selectedVersion.features.projectTypes;

  return (
    <div className="mb-6 rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h2 className="text-base font-semibold">Project setup</h2>
        <p className="text-sm text-muted-foreground">
          Select the calculator version and, where applicable, the project category and type.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label htmlFor="version" className="text-sm font-medium">
            Standard version
          </label>
          <select
            id="version"
            value={version}
            onChange={(e) => onVersionChange(e.target.value as CalculatorVersionId)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            {Object.values(calculatorVersions).map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {showProjectControls && (
          <>
            <div className="space-y-2">
              <label htmlFor="projectCategory" className="text-sm font-medium">
                Project category
              </label>
              <select
                id="projectCategory"
                value={projectCategory}
                onChange={(e) => {
                  onProjectCategoryChange(e.target.value);
                  onProjectTypeChange("");
                }}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="projectType" className="text-sm font-medium">
                Project type
              </label>
              <select
                id="projectType"
                value={projectType}
                onChange={(e) => onProjectTypeChange(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                disabled={!projectCategory}
              >
                <option value="">Select type</option>
                {filteredProjectTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
}