import RoleSelector from '../RoleSelector';

export default function RoleSelectorExample() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-display font-bold mb-2">Choose Your Role</h2>
      <p className="text-muted-foreground mb-6">Select how you want to use the platform</p>
      <RoleSelector onSelectRole={(role) => console.log('Selected role:', role)} />
    </div>
  );
}
