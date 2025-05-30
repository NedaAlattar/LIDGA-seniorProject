"""empty message

Revision ID: 97af1d9cd6e1
Revises: 617e578e3398
Create Date: 2025-04-18 16:06:20.013826

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '97af1d9cd6e1'
down_revision = '617e578e3398'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('bookmarks', schema=None) as batch_op:
        batch_op.alter_column('card_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.create_foreign_key(None, 'cards', ['card_id'], ['id'])

    with op.batch_alter_table('cards', schema=None) as batch_op:
        batch_op.add_column(sa.Column('isBooked', sa.Boolean(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('cards', schema=None) as batch_op:
        batch_op.drop_column('isBooked')

    with op.batch_alter_table('bookmarks', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.alter_column('card_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    # ### end Alembic commands ###
