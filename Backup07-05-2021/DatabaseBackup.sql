USE [CourseDB]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 5/3/2021 10:32:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AccountinCourses]    Script Date: 5/3/2021 10:32:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AccountinCourses](
	[AccountinCourseID] [int] IDENTITY(1,1) NOT NULL,
	[AccountId] [int] NOT NULL,
	[CourseId] [int] NOT NULL,
	[IsBought] [bit] NOT NULL,
	[IsLiked] [bit] NOT NULL,
	[LessonCompleted] [int] NOT NULL,
 CONSTRAINT [PK_AccountinCourses] PRIMARY KEY CLUSTERED 
(
	[AccountinCourseID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AccountinLessons]    Script Date: 5/3/2021 10:32:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AccountinLessons](
	[AccountinLessonID] [int] IDENTITY(1,1) NOT NULL,
	[AccountId] [int] NOT NULL,
	[LessonId] [int] NOT NULL,
	[Point] [int] NOT NULL,
	[LastTaken] [datetime2](7) NOT NULL,
	[IsCompleted] [bit] NOT NULL,
 CONSTRAINT [PK_AccountinLessons] PRIMARY KEY CLUSTERED 
(
	[AccountinLessonID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Accounts]    Script Date: 5/3/2021 10:32:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Accounts](
	[AccountId] [int] IDENTITY(1,1) NOT NULL,
	[Username] [nvarchar](max) NULL,
	[Password] [nvarchar](100) NULL,
	[Role] [nvarchar](max) NULL,
	[IsActive] [bit] NOT NULL,
	[Verification] [bit] NOT NULL,
	[UserId] [int] NOT NULL,
 CONSTRAINT [PK_Accounts] PRIMARY KEY CLUSTERED 
(
	[AccountId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Choices]    Script Date: 5/3/2021 10:32:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Choices](
	[ChoiceId] [int] IDENTITY(1,1) NOT NULL,
	[Answer] [nvarchar](max) NULL,
	[IsCorrect] [bit] NOT NULL,
	[QuizId] [int] NOT NULL,
	[AnswerImage] [varbinary](max) NULL,
	[AnswerImageLink] [nvarchar](max) NULL,
 CONSTRAINT [PK_Choices] PRIMARY KEY CLUSTERED 
(
	[ChoiceId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Comments]    Script Date: 5/3/2021 10:32:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Comments](
	[CommentId] [int] IDENTITY(1,1) NOT NULL,
	[CommentContent] [nvarchar](max) NULL,
	[Rating] [int] NOT NULL,
	[DatePost] [datetime2](7) NOT NULL,
	[ParentCommentId] [int] NULL,
	[AccountId] [int] NOT NULL,
	[CourseId] [int] NULL,
	[LessonId] [int] NULL,
 CONSTRAINT [PK_Comments] PRIMARY KEY CLUSTERED 
(
	[CommentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Courses]    Script Date: 5/3/2021 10:32:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Courses](
	[CourseId] [int] IDENTITY(1,1) NOT NULL,
	[CourseName] [nvarchar](max) NULL,
	[Rating] [int] NOT NULL,
	[NumberOfVoters] [float] NOT NULL,
	[NumberOfParticipants] [float] NOT NULL,
	[Price] [real] NOT NULL,
	[StartDate] [datetime2](7) NOT NULL,
	[CourseDuration] [nvarchar](max) NULL,
	[Description] [nvarchar](max) NULL,
	[ThumbnailImage] [varbinary](max) NULL,
	[Hastag] [nvarchar](max) NULL,
	[Level] [nvarchar](max) NULL,
	[LastUpdate] [datetime2](7) NOT NULL,
	[AccountId] [int] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[LessonNumber] [int] NOT NULL,
 CONSTRAINT [PK_Courses] PRIMARY KEY CLUSTERED 
(
	[CourseId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Lessons]    Script Date: 5/3/2021 10:32:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Lessons](
	[LessonId] [int] IDENTITY(1,1) NOT NULL,
	[LessonTitle] [nvarchar](max) NULL,
	[LessonContent] [nvarchar](max) NULL,
	[LessonNo] [int] NOT NULL,
	[SubTopicId] [int] NOT NULL,
 CONSTRAINT [PK_Lessons] PRIMARY KEY CLUSTERED 
(
	[LessonId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Notification]    Script Date: 5/3/2021 10:32:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Notification](
	[NotificationId] [int] IDENTITY(1,1) NOT NULL,
	[MessageTitle] [nvarchar](max) NULL,
	[Message] [nvarchar](200) NULL,
	[Type] [nvarchar](max) NULL,
	[SendTo] [nvarchar](max) NULL,
	[CreatedDate] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Notification] PRIMARY KEY CLUSTERED 
(
	[NotificationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Questionpools]    Script Date: 5/3/2021 10:32:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Questionpools](
	[QuestionpoolId] [int] IDENTITY(1,1) NOT NULL,
	[QuestionpoolName] [nvarchar](max) NULL,
	[CreatedDate] [datetime2](7) NOT NULL,
	[LastEdited] [datetime2](7) NOT NULL,
	[Hastag] [nvarchar](max) NULL,
	[ThumbnailImage] [varbinary](max) NULL,
	[LessonId] [int] NOT NULL,
	[CourseId] [int] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[ThumbnailImageURL] [nvarchar](max) NULL,
	[Level] [nvarchar](max) NULL,
	[ShareMethod] [nvarchar](max) NULL,
 CONSTRAINT [PK_Questionpools] PRIMARY KEY CLUSTERED 
(
	[QuestionpoolId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Quizs]    Script Date: 5/3/2021 10:32:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Quizs](
	[QuizId] [int] IDENTITY(1,1) NOT NULL,
	[Question] [nvarchar](max) NULL,
	[TopicId] [nvarchar](max) NULL,
	[Time] [int] NOT NULL,
	[Description] [nvarchar](max) NULL,
	[QuizImage] [varbinary](max) NULL,
	[QuestionType] [nvarchar](max) NULL,
	[QuestionpoolId] [int] NOT NULL,
	[QuizImageLink] [nvarchar](max) NULL,
 CONSTRAINT [PK_Quizs] PRIMARY KEY CLUSTERED 
(
	[QuizId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SubTopics]    Script Date: 5/3/2021 10:32:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SubTopics](
	[SubTopicId] [int] IDENTITY(1,1) NOT NULL,
	[SubTopicTitle] [nvarchar](max) NULL,
	[SubTopicNumber] [int] NOT NULL,
	[TopicId] [int] NOT NULL,
 CONSTRAINT [PK_SubTopics] PRIMARY KEY CLUSTERED 
(
	[SubTopicId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Topics]    Script Date: 5/3/2021 10:32:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Topics](
	[TopicId] [int] IDENTITY(1,1) NOT NULL,
	[TopicTitle] [nvarchar](max) NULL,
	[SessionNumber] [int] NOT NULL,
	[LastUpdate] [datetime2](7) NOT NULL,
	[CourseId] [int] NOT NULL,
 CONSTRAINT [PK_Topics] PRIMARY KEY CLUSTERED 
(
	[TopicId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 5/3/2021 10:32:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [nvarchar](max) NULL,
	[LastName] [nvarchar](max) NULL,
	[PhoneNumber] [nvarchar](max) NULL,
	[CreatedDate] [datetime2](7) NOT NULL,
	[LastLogOnDate] [datetime2](7) NOT NULL,
	[Email] [nvarchar](max) NULL,
	[Gender] [nvarchar](max) NULL,
	[AvatarPath] [varbinary](max) NULL,
	[Balance] [real] NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[AccountinCourses] ADD  DEFAULT (CONVERT([bit],(0))) FOR [IsBought]
GO
ALTER TABLE [dbo].[AccountinCourses] ADD  DEFAULT (CONVERT([bit],(0))) FOR [IsLiked]
GO
ALTER TABLE [dbo].[AccountinCourses] ADD  DEFAULT ((0)) FOR [LessonCompleted]
GO
ALTER TABLE [dbo].[AccountinLessons] ADD  DEFAULT (CONVERT([bit],(0))) FOR [IsCompleted]
GO
ALTER TABLE [dbo].[Courses] ADD  DEFAULT (CONVERT([bit],(0))) FOR [IsActive]
GO
ALTER TABLE [dbo].[Courses] ADD  DEFAULT ((0)) FOR [LessonNumber]
GO
ALTER TABLE [dbo].[Questionpools] ADD  DEFAULT (CONVERT([bit],(0))) FOR [IsActive]
GO
ALTER TABLE [dbo].[Quizs] ADD  DEFAULT ((0)) FOR [Time]
GO
ALTER TABLE [dbo].[Quizs] ADD  DEFAULT ((0)) FOR [QuestionpoolId]
GO
ALTER TABLE [dbo].[AccountinCourses]  WITH CHECK ADD  CONSTRAINT [FK_AccountinCourses_Accounts_AccountId] FOREIGN KEY([AccountId])
REFERENCES [dbo].[Accounts] ([AccountId])
GO
ALTER TABLE [dbo].[AccountinCourses] CHECK CONSTRAINT [FK_AccountinCourses_Accounts_AccountId]
GO
ALTER TABLE [dbo].[AccountinCourses]  WITH CHECK ADD  CONSTRAINT [FK_AccountinCourses_Courses_CourseId] FOREIGN KEY([CourseId])
REFERENCES [dbo].[Courses] ([CourseId])
GO
ALTER TABLE [dbo].[AccountinCourses] CHECK CONSTRAINT [FK_AccountinCourses_Courses_CourseId]
GO
ALTER TABLE [dbo].[AccountinLessons]  WITH CHECK ADD  CONSTRAINT [FK_AccountinLessons_Accounts_AccountId] FOREIGN KEY([AccountId])
REFERENCES [dbo].[Accounts] ([AccountId])
GO
ALTER TABLE [dbo].[AccountinLessons] CHECK CONSTRAINT [FK_AccountinLessons_Accounts_AccountId]
GO
ALTER TABLE [dbo].[AccountinLessons]  WITH CHECK ADD  CONSTRAINT [FK_AccountinLessons_Lessons_LessonId] FOREIGN KEY([LessonId])
REFERENCES [dbo].[Lessons] ([LessonId])
GO
ALTER TABLE [dbo].[AccountinLessons] CHECK CONSTRAINT [FK_AccountinLessons_Lessons_LessonId]
GO
ALTER TABLE [dbo].[Accounts]  WITH CHECK ADD  CONSTRAINT [FK_Accounts_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Accounts] CHECK CONSTRAINT [FK_Accounts_Users_UserId]
GO
ALTER TABLE [dbo].[Choices]  WITH CHECK ADD  CONSTRAINT [FK_Choices_Quizs_QuizId] FOREIGN KEY([QuizId])
REFERENCES [dbo].[Quizs] ([QuizId])
GO
ALTER TABLE [dbo].[Choices] CHECK CONSTRAINT [FK_Choices_Quizs_QuizId]
GO
ALTER TABLE [dbo].[Comments]  WITH CHECK ADD  CONSTRAINT [FK_Comments_Accounts_AccountId] FOREIGN KEY([AccountId])
REFERENCES [dbo].[Accounts] ([AccountId])
GO
ALTER TABLE [dbo].[Comments] CHECK CONSTRAINT [FK_Comments_Accounts_AccountId]
GO
ALTER TABLE [dbo].[Comments]  WITH CHECK ADD  CONSTRAINT [FK_Comments_Comments_ParentCommentId] FOREIGN KEY([ParentCommentId])
REFERENCES [dbo].[Comments] ([CommentId])
GO
ALTER TABLE [dbo].[Comments] CHECK CONSTRAINT [FK_Comments_Comments_ParentCommentId]
GO
ALTER TABLE [dbo].[Comments]  WITH CHECK ADD  CONSTRAINT [FK_Comments_Courses_CourseId] FOREIGN KEY([CourseId])
REFERENCES [dbo].[Courses] ([CourseId])
GO
ALTER TABLE [dbo].[Comments] CHECK CONSTRAINT [FK_Comments_Courses_CourseId]
GO
ALTER TABLE [dbo].[Comments]  WITH CHECK ADD  CONSTRAINT [FK_Comments_Lessons_LessonId] FOREIGN KEY([LessonId])
REFERENCES [dbo].[Lessons] ([LessonId])
GO
ALTER TABLE [dbo].[Comments] CHECK CONSTRAINT [FK_Comments_Lessons_LessonId]
GO
ALTER TABLE [dbo].[Courses]  WITH CHECK ADD  CONSTRAINT [FK_Courses_Accounts_AccountId] FOREIGN KEY([AccountId])
REFERENCES [dbo].[Accounts] ([AccountId])
GO
ALTER TABLE [dbo].[Courses] CHECK CONSTRAINT [FK_Courses_Accounts_AccountId]
GO
ALTER TABLE [dbo].[Lessons]  WITH CHECK ADD  CONSTRAINT [FK_Lessons_SubTopics_SubTopicId] FOREIGN KEY([SubTopicId])
REFERENCES [dbo].[SubTopics] ([SubTopicId])
GO
ALTER TABLE [dbo].[Lessons] CHECK CONSTRAINT [FK_Lessons_SubTopics_SubTopicId]
GO
ALTER TABLE [dbo].[Questionpools]  WITH CHECK ADD  CONSTRAINT [FK_Questionpools_Courses_CourseId] FOREIGN KEY([CourseId])
REFERENCES [dbo].[Courses] ([CourseId])
GO
ALTER TABLE [dbo].[Questionpools] CHECK CONSTRAINT [FK_Questionpools_Courses_CourseId]
GO
ALTER TABLE [dbo].[Questionpools]  WITH CHECK ADD  CONSTRAINT [FK_Questionpools_Lessons_LessonId] FOREIGN KEY([LessonId])
REFERENCES [dbo].[Lessons] ([LessonId])
GO
ALTER TABLE [dbo].[Questionpools] CHECK CONSTRAINT [FK_Questionpools_Lessons_LessonId]
GO
ALTER TABLE [dbo].[Quizs]  WITH CHECK ADD  CONSTRAINT [FK_Quizs_Questionpools_QuestionpoolId] FOREIGN KEY([QuestionpoolId])
REFERENCES [dbo].[Questionpools] ([QuestionpoolId])
GO
ALTER TABLE [dbo].[Quizs] CHECK CONSTRAINT [FK_Quizs_Questionpools_QuestionpoolId]
GO
ALTER TABLE [dbo].[SubTopics]  WITH CHECK ADD  CONSTRAINT [FK_SubTopics_Topics_TopicId] FOREIGN KEY([TopicId])
REFERENCES [dbo].[Topics] ([TopicId])
GO
ALTER TABLE [dbo].[SubTopics] CHECK CONSTRAINT [FK_SubTopics_Topics_TopicId]
GO
ALTER TABLE [dbo].[Topics]  WITH CHECK ADD  CONSTRAINT [FK_Topics_Courses_CourseId] FOREIGN KEY([CourseId])
REFERENCES [dbo].[Courses] ([CourseId])
GO
ALTER TABLE [dbo].[Topics] CHECK CONSTRAINT [FK_Topics_Courses_CourseId]
GO
