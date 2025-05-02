
type ProgramHeaderProps = {
  programName: string;
};

export function ProgramHeader({ programName }: ProgramHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold">{programName}</h2>
    </div>
  );
}
