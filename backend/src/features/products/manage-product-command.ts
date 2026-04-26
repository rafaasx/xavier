import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { createAffiliateLink } from '../affiliate-links/create-affiliate-link';
import { deleteAffiliateLink } from '../affiliate-links/delete-affiliate-link';
import { updateAffiliateLink } from '../affiliate-links/update-affiliate-link';
import { createProductMedia } from '../media/create-product-media';
import { deleteMedia } from '../media/delete-media';
import { reorderProductMedias } from '../media/reorder-product-medias';
import { updateMedia } from '../media/update-media';
import { createTag } from '../tags/create-tag';
import { deleteTag } from '../tags/delete-tag';
import { updateProduct } from './update-product';
import { createProduct } from './create-product';
import { deleteProduct } from './delete-product';
import { methodNotAllowed, validationError } from '../../shared/http';
import { parseWithZod, readJsonBody } from '../../shared/validation';

const actionSchema = z.object({
  action: z.enum([
    'create_product',
    'update_product',
    'delete_product',
    'create_tag',
    'delete_tag',
    'create_media',
    'update_media',
    'delete_media',
    'reorder_medias',
    'create_affiliate_link',
    'update_affiliate_link',
    'delete_affiliate_link',
  ]),
});

const productIdSchema = z.object({
  productId: z.string().uuid(),
});

const tagIdSchema = z.object({
  tagId: z.string().uuid(),
});

const mediaIdSchema = z.object({
  mediaId: z.string().uuid(),
});

const affiliateLinkIdSchema = z.object({
  affiliateLinkId: z.string().uuid(),
});

function setRouteParam(req: VercelRequest, id: string): void {
  (req as VercelRequest & { params?: Record<string, unknown> }).params = {
    ...((req as VercelRequest & { params?: Record<string, unknown> }).params ?? {}),
    id,
  };

  req.query = {
    ...req.query,
    id,
  };
}

export async function manageProductCommand(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    methodNotAllowed(req, res, ['POST', 'OPTIONS']);
    return;
  }

  const body = await readJsonBody(req);
  const parsedAction = parseWithZod(actionSchema, body);
  if (parsedAction.success === false) {
    validationError(req, res, parsedAction.details);
    return;
  }

  const action = parsedAction.data.action;

  if (action === 'create_product') {
    req.body = body;
    await createProduct(req, res);
    return;
  }

  if (action === 'update_product') {
    const parsedProductId = parseWithZod(productIdSchema, body);
    if (parsedProductId.success === false) {
      validationError(req, res, parsedProductId.details);
      return;
    }

    setRouteParam(req, parsedProductId.data.productId);
    req.body = body;
    await updateProduct(req, res);
    return;
  }

  if (action === 'delete_product') {
    const parsedProductId = parseWithZod(productIdSchema, body);
    if (parsedProductId.success === false) {
      validationError(req, res, parsedProductId.details);
      return;
    }

    setRouteParam(req, parsedProductId.data.productId);
    await deleteProduct(req, res);
    return;
  }

  if (action === 'create_tag') {
    req.body = body;
    await createTag(req, res);
    return;
  }

  if (action === 'delete_tag') {
    const parsedTagId = parseWithZod(tagIdSchema, body);
    if (parsedTagId.success === false) {
      validationError(req, res, parsedTagId.details);
      return;
    }

    setRouteParam(req, parsedTagId.data.tagId);
    await deleteTag(req, res);
    return;
  }

  if (action === 'create_media') {
    const parsedProductId = parseWithZod(productIdSchema, body);
    if (parsedProductId.success === false) {
      validationError(req, res, parsedProductId.details);
      return;
    }

    setRouteParam(req, parsedProductId.data.productId);
    req.body = body;
    await createProductMedia(req, res);
    return;
  }

  if (action === 'update_media') {
    const parsedMediaId = parseWithZod(mediaIdSchema, body);
    if (parsedMediaId.success === false) {
      validationError(req, res, parsedMediaId.details);
      return;
    }

    setRouteParam(req, parsedMediaId.data.mediaId);
    req.body = body;
    await updateMedia(req, res);
    return;
  }

  if (action === 'delete_media') {
    const parsedMediaId = parseWithZod(mediaIdSchema, body);
    if (parsedMediaId.success === false) {
      validationError(req, res, parsedMediaId.details);
      return;
    }

    setRouteParam(req, parsedMediaId.data.mediaId);
    await deleteMedia(req, res);
    return;
  }

  if (action === 'reorder_medias') {
    const parsedProductId = parseWithZod(productIdSchema, body);
    if (parsedProductId.success === false) {
      validationError(req, res, parsedProductId.details);
      return;
    }

    setRouteParam(req, parsedProductId.data.productId);
    req.body = body;
    await reorderProductMedias(req, res);
    return;
  }

  if (action === 'create_affiliate_link') {
    const parsedProductId = parseWithZod(productIdSchema, body);
    if (parsedProductId.success === false) {
      validationError(req, res, parsedProductId.details);
      return;
    }

    setRouteParam(req, parsedProductId.data.productId);
    req.body = body;
    await createAffiliateLink(req, res);
    return;
  }

  if (action === 'update_affiliate_link') {
    const parsedAffiliateLinkId = parseWithZod(affiliateLinkIdSchema, body);
    if (parsedAffiliateLinkId.success === false) {
      validationError(req, res, parsedAffiliateLinkId.details);
      return;
    }

    setRouteParam(req, parsedAffiliateLinkId.data.affiliateLinkId);
    req.body = body;
    await updateAffiliateLink(req, res);
    return;
  }

  const parsedAffiliateLinkId = parseWithZod(affiliateLinkIdSchema, body);
  if (parsedAffiliateLinkId.success === false) {
    validationError(req, res, parsedAffiliateLinkId.details);
    return;
  }

  setRouteParam(req, parsedAffiliateLinkId.data.affiliateLinkId);
  await deleteAffiliateLink(req, res);
}

