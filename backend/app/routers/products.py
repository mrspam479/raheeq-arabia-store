from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.models import Product
from app.deps import get_db
from app.schemas.products import ProductDetailOut, ProductListOut, ProductSummaryOut, SeoOut

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=ProductListOut)
async def list_products(db: AsyncSession = Depends(get_db)) -> ProductListOut:
    result = await db.execute(
        select(Product)
        .where(Product.is_active.is_(True))
        .options(selectinload(Product.offers))
        .order_by(Product.sort_order)
    )
    products = result.scalars().all()
    return ProductListOut(
        products=[
            ProductSummaryOut(
                id=p.id,
                slug=p.slug,
                name_ar=p.name_ar,
                hero_tag_ar=p.hero_tag_ar,
                short_description_ar=p.short_description_ar,
                rating_value=p.rating_value,
                review_count=p.review_count,
                stock_label_ar=p.stock_label_ar,
                cover_image_url=p.cover_image_url,
                offers=[o for o in p.offers if o.is_active],
            )
            for p in products
        ]
    )


@router.get("/{slug}", response_model=ProductDetailOut)
async def get_product(slug: str, db: AsyncSession = Depends(get_db)) -> ProductDetailOut:
    result = await db.execute(
        select(Product)
        .where(Product.slug == slug, Product.is_active.is_(True))
        .options(
            selectinload(Product.offers),
            selectinload(Product.ingredients),
            selectinload(Product.reviews),
            selectinload(Product.faqs),
        )
    )
    product = result.scalar_one_or_none()
    if product is None:
        raise HTTPException(status_code=404, detail={"code": "NOT_FOUND", "message": "Product not found"})

    return ProductDetailOut(
        id=product.id,
        slug=product.slug,
        name_ar=product.name_ar,
        working_name=product.working_name,
        hero_tag_ar=product.hero_tag_ar,
        short_description_ar=product.short_description_ar,
        long_description_ar=product.long_description_ar,
        rating_value=product.rating_value,
        review_count=product.review_count,
        stock_label_ar=product.stock_label_ar,
        cover_image_url=product.cover_image_url,
        gallery_image_urls=product.gallery_image_urls or [],
        offers=[o for o in product.offers if o.is_active],
        ingredients=list(product.ingredients),
        reviews=[r for r in product.reviews if r.is_published],
        faqs=[f for f in product.faqs if f.is_active],
        seo=SeoOut(
            title_ar=product.seo_title_ar,
            description_ar=product.seo_description_ar,
        ),
    )
