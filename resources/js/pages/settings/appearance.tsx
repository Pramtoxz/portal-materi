import { Head } from '@inertiajs/react';
import Lottie from 'lottie-react';
import animationData from '@/assets/loadingsetting.json';
import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tema" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Tema" description="Pilih Tema yang Anda inginkan" />
                    <AppearanceTabs />
                    <Lottie 
                        animationData={animationData} 
                        loop={true}
                        autoplay={true}
                    />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
