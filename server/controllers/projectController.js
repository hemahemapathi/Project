// Import project, feature and task models
import Project from "../models/Project.js"
import User from "../models/User.js";

export
    // Get all projects
    async function getAllProjects(req, res) {
    try {
        const allProjects = await Project.find({});

        if (!allProjects) {
            return res.status(400).json({ message: "No projects found." });
        }

        res.status(200).json(allProjects);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export
    // Get a project by its id
    async function getProject({ params }, res) {
    try {
        const project = await Project.findOne({ _id: params.projectId }).populate(
            {
                path: "features",
                populate: "featureAssignee",
            }
        );

        if (!project) {
            return res
                .status(400)
                .json({ message: "No project found with that id." });
        }

        res.status(200).json(project);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export
    // Create project
    async function createProject({ body }, res) {
    try {
        const project = await Project.create(body);

        if (!project) {
            return res.status(400).json({ message: "Unable to create project." });
        }

        // Add project to list of those created by the current user (manager)
        const user = await User.findOneAndUpdate(
            { _id: body.projectManager },
            { $addToSet: { projects: project._id } },
            { new: true }
        );

        if (!user) {
            return res
                .status(400)
                .json({ message: "Project created but not linked to manager." });
        }

        res.status(200).json(project);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export
    // Update project
    async function updateProject({ body, params }, res) {
    try {
        const project = await Project.findOneAndUpdate(
            { _id: params.projectId },
            { $set: body },
            { runValidators: true, new: true }
        );

        if (!project) {
            return res.status(400).json({ message: "Unable to update project." });
        }

        res.status(200).json(project);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export
    // Delete project
    async function deleteProject({ params }, res) {
    try {
        const project = await Project.findOneAndDelete({ _id: params.projectId });

        if (!project) {
            return res.status(400).json({ message: "Unable to delete project." });
        }

        res.status(200).json({ message: "Project deleted." });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export
    // Get all features in project
    async function getAllFeatures({ params }, res) {
    try {
        const project = await Project.findOne({ _id: params.projectId }).populate(
            {
                path: "features",
                populate: "featureAssignee",
            }
        );
        const allFeatures = project.features;

        if (!allFeatures) {
            return res.status(400).json({ message: "No features found." });
        }

        res.status(200).json(allFeatures);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export
    // Get one feature in project
    async function getFeature({ params }, res) {
    try {
        const project = await Project.findOne({ _id: params.projectId }).populate(
            {
                path: "features",
                populate: "featureAssignee",
            }
        );
        const feature = project.features.id(params.featureId);

        if (!feature) {
            return res.status(400).json({ message: "Unable to get feature." });
        }

        res.status(200).json(feature);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export
    // Add feature to project
    async function createFeature({ body, params }, res) {
    try {
        const project = await Project.findOneAndUpdate(
            { _id: params.projectId },
            { $push: { features: body } },
            { runValidators: true, new: true }
        );

        if (!project) {
            return res.status(400).json({ message: "Unable to create feature." });
        }

        res.status(200).json(project);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export
    // Update feature in project
    async function updateFeature({ body, params }, res) {
    try {
        const projectData = await Project.findOne({ _id: params.projectId });
        const feature = projectData.features.id(params.featureId);
        const updatedFeature = { ...feature.toJSON(), ...body };

        const project = await Project.findOneAndUpdate(
            { _id: params.projectId, "features._id": params.featureId },
            { $set: { "features.$": updatedFeature } },
            { runValidators: true, new: true }
        );

        if (!project) {
            return res.status(400).json({ message: "Unable to update feature." });
        }

        res.status(200).json(project);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export
    // Delete feature in project
    async function deleteFeature({ params }, res) {
    try {
        const project = await Project.findOneAndUpdate(
            { _id: params.projectId },
            { $pull: { features: { _id: params.featureId } } },
            { new: true }
        );

        if (!project) {
            return res.status(400).json({ message: "Unable to delete feature." });
        }

        res.status(200).json({ message: "Feature deleted." });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export async function getAllTasks({ params }, res) {
    try {
        const project = await Project.findOne({ _id: params.projectId }).populate({
            path: 'features',
            match: { _id: params.featureId },
            populate: { path: 'tasks' }
        });

        if (!project || !project.features.length) {
            return res.status(404).json({ message: "Project or feature not found." });
        }

        const tasks = project.features[0].tasks;

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: "No tasks found for this feature." });
        }

        res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}


export
    // Get one task in feature
    async function getTask({ params }, res) {
    try {
        const project = await Project.findOne({ _id: params.projectId });
        const feature = project.features.id(params.featureId);
        const task = feature.tasks.id(params.taskId);

        if (!task) {
            return res.status(400).json({ message: "Unable to get task." });
        }

        res.status(200).json(task);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export
    // Add task to feature
    async function createTask({ body, params }, res) {
    try {
        const project = await Project.findOneAndUpdate(
            { _id: params.projectId, "features._id": params.featureId },
            { $push: { "features.$.tasks": body } },
            { runValidators: true, new: true }
        );

        if (!project) {
            return res.status(400).json({ message: "Unable to create task." });
        }

        res.status(200).json(project);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export
    // Update task in feature
    async function updateTask({ body, params }, res) {
    try {
        const projectData = await Project.findOne({ _id: params.projectId });
        const featureData = projectData.features.id(params.featureId);
        const taskArray = featureData.tasks;

        const newTaskArray = taskArray.map((item) => {
            if (item._id == params.taskId) {
                return { ...item.toJSON(), ...body };
            } else return item;
        });

        const project = await Project.findOneAndUpdate(
            {
                _id: params.projectId,
                "features._id": params.featureId,
            },
            { $set: { "features.$.tasks": newTaskArray } },
            { runValidators: true, new: true }
        );

        if (!project) {
            return res.status(400).json({ message: "Unable to update task." });
        }

        res.status(200).json(project);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export
    // Delete task in feature
    async function deleteTask({ params }, res) {
    try {
        const project = await Project.findOneAndUpdate(
            { _id: params.projectId, "features._id": params.featureId },
            { $pull: { "features.$.tasks": { _id: params.taskId } } },
            { new: true }
        );

        if (!project) {
            return res.status(400).json({ message: "Unable to delete task." });
        }

        res.status(200).json({ message: "Task deleted." });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
};

export async function addAttachment(req, res) {
    try {
      const task = await findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      task.attachments.push(req.file.path);
      await task.save();
      res.status(200).json({ message: 'File uploaded successfully', task });
    } catch (error) {
      res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
  }