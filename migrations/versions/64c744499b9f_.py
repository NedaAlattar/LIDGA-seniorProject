"""empty message

Revision ID: 64c744499b9f
Revises: b0c6e8d13422
Create Date: 2025-03-23 23:31:43.155294

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '64c744499b9f'
down_revision = 'b0c6e8d13422'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('card', schema=None) as batch_op:
        batch_op.add_column(sa.Column('isCorrect', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('diff', sa.Integer(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('card', schema=None) as batch_op:
        batch_op.drop_column('diff')
        batch_op.drop_column('isCorrect')

    # ### end Alembic commands ###
