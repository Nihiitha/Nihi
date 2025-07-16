import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

interface Skill {
  id: number;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface SkillsManagerProps {
  skills: Skill[];
  onSkillsChange: (skills: Skill[]) => void;
  disabled?: boolean;
}

const SkillsManager: React.FC<SkillsManagerProps> = ({
  skills,
  onSkillsChange,
  disabled = false
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'intermediate' as Skill['level'] });
  const [errors, setErrors] = useState<{ name?: string }>({});

  const skillLevels = [
    { value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-blue-100 text-blue-800' },
    { value: 'advanced', label: 'Advanced', color: 'bg-purple-100 text-purple-800' },
    { value: 'expert', label: 'Expert', color: 'bg-red-100 text-red-800' }
  ];

  const validateSkill = (skill: { name: string; level: string }) => {
    const errors: { name?: string } = {};
    
    if (!skill.name.trim()) {
      errors.name = 'Skill name is required';
    } else if (skill.name.length < 2) {
      errors.name = 'Skill name must be at least 2 characters';
    } else if (skill.name.length > 50) {
      errors.name = 'Skill name must be less than 50 characters';
    } else if (skills.some(s => s.name.toLowerCase() === skill.name.toLowerCase() && s.id !== editingId)) {
      errors.name = 'This skill already exists';
    }

    return errors;
  };

  const handleAddSkill = () => {
    const validationErrors = validateSkill(newSkill);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const skill: Skill = {
      id: Date.now(),
      name: newSkill.name.trim(),
      level: newSkill.level
    };

    onSkillsChange([...skills, skill]);
    setNewSkill({ name: '', level: 'intermediate' });
    setIsAdding(false);
    setErrors({});
  };

  const handleEditSkill = (id: number) => {
    const skill = skills.find(s => s.id === id);
    if (skill) {
      setNewSkill({ name: skill.name, level: skill.level });
      setEditingId(id);
      setIsAdding(true);
    }
  };

  const handleUpdateSkill = () => {
    if (!editingId) return;

    const validationErrors = validateSkill(newSkill);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedSkills = skills.map(skill =>
      skill.id === editingId
        ? { ...skill, name: newSkill.name.trim(), level: newSkill.level }
        : skill
    );

    onSkillsChange(updatedSkills);
    setNewSkill({ name: '', level: 'intermediate' });
    setEditingId(null);
    setIsAdding(false);
    setErrors({});
  };

  const handleRemoveSkill = (id: number) => {
    onSkillsChange(skills.filter(skill => skill.id !== id));
  };

  const handleCancel = () => {
    setNewSkill({ name: '', level: 'intermediate' });
    setEditingId(null);
    setIsAdding(false);
    setErrors({});
  };

  const getSkillLevelColor = (level: Skill['level']) => {
    const levelConfig = skillLevels.find(l => l.value === level);
    return levelConfig?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {/* Skills List */}
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className={`px-3 py-1 rounded-full text-sm font-medium ${getSkillLevelColor(skill.level)} flex items-center gap-2`}
          >
            <span>{skill.name}</span>
            {!disabled && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEditSkill(skill.id)}
                  className="hover:text-gray-700 transition-colors duration-200"
                >
                  <FaEdit className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleRemoveSkill(skill.id)}
                  className="hover:text-red-600 transition-colors duration-200"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Skill Form */}
      {isAdding && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">
              {editingId ? 'Edit Skill' : 'Add New Skill'}
            </h4>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skill Name *
              </label>
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) => {
                  setNewSkill(prev => ({ ...prev, name: e.target.value }));
                  if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                }}
                placeholder="e.g., React, Python, AWS"
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                maxLength={50}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skill Level
              </label>
              <select
                value={newSkill.level}
                onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value as Skill['level'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {skillLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={editingId ? handleUpdateSkill : handleAddSkill}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              {editingId ? 'Update' : 'Add'} Skill
            </button>
          </div>
        </div>
      )}

      {/* Add Skill Button */}
      {!isAdding && !disabled && (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
        >
          <FaPlus className="w-4 h-4" />
          Add Skill
        </button>
      )}
    </div>
  );
};

export default SkillsManager; 