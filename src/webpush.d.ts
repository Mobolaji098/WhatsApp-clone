import { PushSubscription as WebPushPushSubscription } from 'web-push';
import { PushSubscription as NextPushSubscription } from 'next/server';

export type PushSubscription = WebPushPushSubscription & NextPushSubscription;