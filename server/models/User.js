import mongoose, { Schema } from "mongoose";
import { hash, compare } from "bcrypt";

// Schema to create User model
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // Use regex to validate email
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please use a valid email address.",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    // Array of ids of projects created by a user
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    // Array of ids of people on a user's team
    teamMembers: [
      {
        type: Schema.Types.ObjectId,
        ref: "TeamMember",
      },
    ],
  },
  // Allow use of virtuals below
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Hash user's password before saving
UserSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await hash(this.password, saltRounds);
  }
  next();
});

// Custom method to compare and validate password when user logs in
UserSchema.methods.isCorrectPassword = async function (password) {
  return compare(password, this.password);
};

// Create a virtual property "projectCount" that gets the number of projects a user has
UserSchema.virtual("projectCount").get(function () {
  return this.projects? this.projects.length :0 ;
});

// Create a virtual property "teamCount" that gets the number of people in a user's team
UserSchema.virtual("teamCount").get(function () {
  return this.teamMembers? this.teamMembers.length : 0;
});

UserSchema.virtual('taskCount').get(function() {
  return this.tasks ? this.tasks.length : 0;
});

UserSchema.virtual('completedTaskCount').get(function() {
  if (!this.tasks) return 0;
  return this.tasks.filter(task => task.status === 'completed').length;
});
// Initialise User model
const User = mongoose.model("User", UserSchema);

export default User;
