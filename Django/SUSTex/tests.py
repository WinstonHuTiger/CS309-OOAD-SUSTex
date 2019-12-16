from django.test import TestCase
from . import models
from Utils.diff_match_patch import diff_match_patch


# Create your tests here.
class ModelsTest(TestCase):

    def test_create_project_file(self):
        project = models.Project(random_str='test')
        project.create_project_path()

    def test_diff_match_path(self):
        dmp = diff_match_patch()
        difference = dmp.diff_main("""I am the very model of a modern Major-General,
I've information vegetable, animal, and mineral,
I know the kings of England, and I quote the fights historical,
From Marathon to Waterloo, in order categorical.
        """, """I am the very model of a cartoon individual,
My animation's comical, unusual, and whimsical,
I'm quite adept at funny gags, comedic theory I have read,
From wicked puns and stupid jokes to anvils that drop on your head.
        """)
        print(difference)
        dmp.diff_cleanupSemantic(difference)
        print(difference)