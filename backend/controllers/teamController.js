const Team = require('../models/Team');
const { handleUpload } = require('../middleware/uploadMiddleware');

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
const getTeam = async (req, res) => {
  try {
    const team = await Team.find({}).sort({ createdAt: 1 });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a team member
// @route   POST /api/team
// @access  Private
const createTeam = async (req, res) => {
  try {
    const { name, role, bio, socialLinks } = req.body;

    let imageUrl = req.body.image || '';
    if (req.file) {
      imageUrl = await handleUpload(req.file);
    }

    const teamMember = await Team.create({
      name,
      role,
      bio: bio || '',
      image: imageUrl,
      socialLinks: socialLinks ? (typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks) : {},
    });

    res.status(201).json(teamMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a team member
// @route   PUT /api/team/:id
// @access  Private
const updateTeam = async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);

    if (teamMember) {
      teamMember.name = req.body.name || teamMember.name;
      teamMember.role = req.body.role || teamMember.role;
      teamMember.bio = req.body.bio || teamMember.bio;

      if (req.body.socialLinks) {
        teamMember.socialLinks = typeof req.body.socialLinks === 'string'
          ? JSON.parse(req.body.socialLinks)
          : req.body.socialLinks;
      }

      if (req.file) {
        teamMember.image = await handleUpload(req.file);
      } else if (req.body.image !== undefined) {
        teamMember.image = req.body.image;
      }

      const updatedTeamMember = await teamMember.save();
      res.json(updatedTeamMember);
    } else {
      res.status(404).json({ message: 'Team member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a team member
// @route   DELETE /api/team/:id
// @access  Private
const deleteTeam = async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);

    if (teamMember) {
      await teamMember.deleteOne();
      res.json({ message: 'Team member removed successfully' });
    } else {
      res.status(404).json({ message: 'Team member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
};
