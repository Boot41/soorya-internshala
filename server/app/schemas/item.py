from pydantic import BaseModel


class ItemBase(BaseModel):
    title: str
    description: str | None = None


class ItemCreate(ItemBase):
    pass


class ItemInDBBase(ItemBase):
    id: int

    class Config:
        from_attributes = True


class Item(ItemInDBBase):
    pass
