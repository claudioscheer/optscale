"""create hava integration table

Revision ID: ef5ed8b5bed4
Revises: 3273906c73ac
Create Date: 2023-10-25 21:26:08.452719

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "ef5ed8b5bed4"
down_revision = "3273906c73ac"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "hava_integration",
        sa.Column("deleted_at", sa.Integer(), nullable=False),
        sa.Column("organization_id", sa.String(length=36), nullable=False),
        sa.Column("created_at", sa.Integer(), nullable=False),
        sa.Column("hava_api_key", sa.TEXT(), nullable=True),
        sa.Column("enabled", sa.Boolean(), nullable=False, default=False),
        sa.PrimaryKeyConstraint("organization_id"),
        sa.ForeignKeyConstraint(
            ["organization_id"],
            ["organization.id"],
        ),
    )


def downgrade():
    op.drop_table("hava_integration")
