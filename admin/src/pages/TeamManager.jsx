import React, { useState, useEffect } from 'react';
import { getTeam, createTeam, updateTeam, deleteTeam } from '../services/api';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiUsers,
  FiLinkedin,
  FiTwitter,
  FiGithub,
  FiImage,
} from 'react-icons/fi';

const TeamManager = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: 'Digital Marketing Strategist',
    bio: '',
    image: '',
    linkedin: '',
    twitter: '',
    github: '',
  });
  const [imageFile, setImageFile] = useState(null);

  const { addToast } = useToast();

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const data = await getTeam();
      setTeam(data || []);
    } catch (err) {
      console.error('Fetch team error:', err);
      addToast('Failed to load team members', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const openCreateModal = () => {
    setSelectedMember(null);
    setFormData({
      name: '',
      role: 'Digital Marketing Strategist',
      bio: '',
      image: '',
      linkedin: '',
      twitter: '',
      github: '',
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setSelectedMember(member);
    setFormData({
      name: member.name || '',
      role: member.role || 'Digital Marketing Strategist',
      bio: member.bio || '',
      image: member.image || '',
      linkedin: member.socialLinks?.linkedin || '',
      twitter: member.socialLinks?.twitter || '',
      github: member.socialLinks?.github || '',
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openDeleteModal = (member) => {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.role) {
      addToast('Please enter member name and role', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const dataToSubmit = new FormData();
      dataToSubmit.append('name', formData.name);
      dataToSubmit.append('role', formData.role);
      dataToSubmit.append('bio', formData.bio);
      dataToSubmit.append(
        'socialLinks',
        JSON.stringify({
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          github: formData.github,
        })
      );

      if (imageFile) {
        dataToSubmit.append('image', imageFile);
      } else if (formData.image) {
        dataToSubmit.append('image', formData.image);
      }

      if (selectedMember) {
        await updateTeam(selectedMember._id, dataToSubmit);
        addToast('Team member profile updated!', 'success');
      } else {
        await createTeam(dataToSubmit);
        addToast('New team member added!', 'success');
      }

      setIsModalOpen(false);
      fetchTeamMembers();
    } catch (err) {
      console.error('Save team member error:', err);
      addToast(err.response?.data?.message || 'Failed to save team member', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMember) return;
    try {
      setSubmitting(true);
      await deleteTeam(selectedMember._id);
      addToast('Team member removed!', 'success');
      setIsDeleteModalOpen(false);
      fetchTeamMembers();
    } catch (err) {
      console.error('Delete team member error:', err);
      addToast('Failed to delete team member', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Team Members
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Manage agency team members, profiles, bios, and social links
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
        >
          <FiPlus size={16} /> Add Team Member
        </button>
      </div>

      {/* Team Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : team.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
          <FiUsers className="mx-auto text-4xl text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Team Members Found</h3>
          <p className="text-xs text-slate-400 mt-1">Add your agency leadership and specialist team.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-slate-100 mx-auto overflow-hidden shadow-inner mb-4">
                  {member.image ? (
                    <img
                      src={
                        member.image.startsWith('http')
                          ? member.image
                          : `http://localhost:5000${member.image}`
                      }
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-blue-50 text-blue-600 font-bold text-xl">
                      {member.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full inline-block mt-1">
                  {member.role}
                </span>

                {member.bio && (
                  <p className="text-xs text-slate-500 mt-3 line-clamp-3 leading-relaxed">
                    {member.bio}
                  </p>
                )}

                {/* Social links */}
                <div className="flex items-center justify-center gap-3 mt-4 text-slate-400">
                  {member.socialLinks?.linkedin && (
                    <a
                      href={member.socialLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-blue-600 transition-colors"
                    >
                      <FiLinkedin size={16} />
                    </a>
                  )}
                  {member.socialLinks?.twitter && (
                    <a
                      href={member.socialLinks.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-blue-400 transition-colors"
                    >
                      <FiTwitter size={16} />
                    </a>
                  )}
                  {member.socialLinks?.github && (
                    <a
                      href={member.socialLinks.github}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-slate-800 transition-colors"
                    >
                      <FiGithub size={16} />
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <button
                  onClick={() => openEditModal(member)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <FiEdit /> Edit Profile
                </button>
                <button
                  onClick={() => openDeleteModal(member)}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  <FiTrash2 /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedMember ? 'Edit Team Member' : 'Add New Team Member'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Neeraj Sharma"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Role / Designation *
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g. Head of Performance Marketing"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Bio / Short Description
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows="3"
              placeholder="Brief professional background and expertise..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Twitter URL
              </label>
              <input
                type="url"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                placeholder="https://x.com/..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Member Photo (File Upload or URL)
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="Or paste photo URL"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : selectedMember ? 'Update Member' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Remove Team Member"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Are you sure you want to remove <strong>{selectedMember?.name}</strong> from team list?
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={submitting}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-500/20 disabled:opacity-50"
            >
              {submitting ? 'Removing...' : 'Remove Member'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeamManager;
