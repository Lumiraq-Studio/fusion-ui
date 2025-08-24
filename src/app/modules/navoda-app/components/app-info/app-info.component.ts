import {Component, effect, inject, signal} from '@angular/core';
import {
    faCloudDownload,
    faCloudUpload,
    faDownload,
    faEllipsisV,
    faExclamationCircle,
    faFileAlt,
    faHistory,
    faMobileAndroid,
    faSearch,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ApkService} from "../../services/navoda-app.service";
import {LoadingService, NotificationService, PaginationComponent} from "../../../../core";
import {ApkDTO} from "../../interface/apk.entity";
import {ReactiveFormsModule} from "@angular/forms";
import QRCode from 'qrcode';
import {StatusBadgeComponent} from "../../../shared";

@Component({
    selector: 'app-app-info',
    templateUrl: './app-info.component.html',
    standalone: true,
    imports: [
        FaIconComponent,
        PaginationComponent,
        ReactiveFormsModule,
        StatusBadgeComponent,
    ],
    styleUrl: './app-info.component.scss'
})
export class AppInfoComponent {
    protected readonly faCloudUpload = faCloudUpload;
    protected readonly faSearch = faSearch;
    protected readonly faDownload = faDownload;
    protected readonly faFileAlt = faFileAlt;
    protected readonly faHistory = faHistory;
    protected readonly faEllipsisV = faEllipsisV;
    protected readonly faCloudDownload = faCloudDownload;
    protected readonly faMobileAndroid1 = faMobileAndroid;
    protected readonly faXmark = faXmark;

    $$DownloadModal = signal(false);
    qrCodeDataUrl = signal<string>('');
    qrError = signal<string>('');
    selectedApk = signal<ApkDTO | null>(null);

    apkDTOS: ApkDTO[] = []
    totalItems = 0
    itemsPerPage = 0
    searchParams = {
        apk_version: '',
        apk_platform: '',
        apk_status: '',
        page_number: 1,
        items_per_page: 10
    }

    loading = inject(LoadingService);
    notification = inject(NotificationService);
    apkService = inject(ApkService);

    constructor() {
        effect(() => {
            this.apkDTOS = this.apkService.all()
        });

        effect(() => {
            const stat = this.apkService.stat()
            if (stat) {
                this.totalItems = stat.totalItems;
                this.itemsPerPage = stat.itemsPerPage;
            }
        });

        effect(() => {
            const apk = this.selectedApk();
            if (apk) {
                this.generateQRCode(apk);
            }
        });
    }

    async generateQRCode(apk: ApkDTO) {
        try {
            const downloadUrl = `${apk.link}`;
            const qrCode = await QRCode.toDataURL(downloadUrl, {
                width: 192,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            });
            this.qrCodeDataUrl.set(qrCode);
            this.qrError.set('');
        } catch (err) {
            console.error('Error generating QR code:', err);
            this.qrError.set('Failed to generate QR code. Please try again.');
            this.qrCodeDataUrl.set('');
        }
    }

    onPageChange(pageNumber: number) {
        this.searchParams = {
            ...this.searchParams,
            page_number: Number(pageNumber)
        };
    }

    openDownloadModal(apk: ApkDTO) {
        this.selectedApk.set(apk);
        this.$$DownloadModal.set(true);
    }
    isDownloading = signal(false);

    async downloadApk() {
        const apk = this.selectedApk();
        if (!apk?.link) {
            return;
        }

        try {
            this.isDownloading.set(true);
            const link = document.createElement('a');
            link.href = apk.link;
            link.download = `${apk.link}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            this.closeModal();
        } catch (error) {
            console.error('Download error:', error);
        } finally {
            this.isDownloading.set(false);
        }
    }

    closeModal() {
        this.$$DownloadModal.set(false);
        this.selectedApk.set(null);
        this.qrCodeDataUrl.set('');
        this.qrError.set('');
    }

    protected readonly faExclamationCircle = faExclamationCircle;
}