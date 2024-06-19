import { ModuleWithProviders } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./map/map.component";
import * as i2 from "./layer/layer.component";
import * as i3 from "./draggable/draggable.directive";
import * as i4 from "./image/image.component";
import * as i5 from "./source/vector-source.component";
import * as i6 from "./source/geojson/geojson-source.component";
import * as i7 from "./source/raster-dem-source.component";
import * as i8 from "./source/raster-source.component";
import * as i9 from "./source/image-source.component";
import * as i10 from "./source/video-source.component";
import * as i11 from "./source/canvas-source.component";
import * as i12 from "./source/geojson/feature.component";
import * as i13 from "./marker/marker.component";
import * as i14 from "./popup/popup.component";
import * as i15 from "./control/control.component";
import * as i16 from "./control/fullscreen-control.directive";
import * as i17 from "./control/navigation-control.directive";
import * as i18 from "./control/geolocate-control.directive";
import * as i19 from "./control/attribution-control.directive";
import * as i20 from "./control/scale-control.directive";
import * as i21 from "./markers-for-clusters/markers-for-clusters.component";
import * as i22 from "@angular/common";
export declare class NgxMapboxGLModule {
    static withConfig(config: {
        accessToken: string;
    }): ModuleWithProviders<NgxMapboxGLModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxMapboxGLModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<NgxMapboxGLModule, [typeof i1.MapComponent, typeof i2.LayerComponent, typeof i3.DraggableDirective, typeof i4.ImageComponent, typeof i5.VectorSourceComponent, typeof i6.GeoJSONSourceComponent, typeof i7.RasterDemSourceComponent, typeof i8.RasterSourceComponent, typeof i9.ImageSourceComponent, typeof i10.VideoSourceComponent, typeof i11.CanvasSourceComponent, typeof i12.FeatureComponent, typeof i13.MarkerComponent, typeof i14.PopupComponent, typeof i15.ControlComponent, typeof i16.FullscreenControlDirective, typeof i17.NavigationControlDirective, typeof i18.GeolocateControlDirective, typeof i19.AttributionControlDirective, typeof i20.ScaleControlDirective, typeof i21.PointDirective, typeof i21.ClusterPointDirective, typeof i21.MarkersForClustersComponent], [typeof i22.CommonModule], [typeof i1.MapComponent, typeof i2.LayerComponent, typeof i3.DraggableDirective, typeof i4.ImageComponent, typeof i5.VectorSourceComponent, typeof i6.GeoJSONSourceComponent, typeof i7.RasterDemSourceComponent, typeof i8.RasterSourceComponent, typeof i9.ImageSourceComponent, typeof i10.VideoSourceComponent, typeof i11.CanvasSourceComponent, typeof i12.FeatureComponent, typeof i13.MarkerComponent, typeof i14.PopupComponent, typeof i15.ControlComponent, typeof i16.FullscreenControlDirective, typeof i17.NavigationControlDirective, typeof i18.GeolocateControlDirective, typeof i19.AttributionControlDirective, typeof i20.ScaleControlDirective, typeof i21.PointDirective, typeof i21.ClusterPointDirective, typeof i21.MarkersForClustersComponent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<NgxMapboxGLModule>;
}
