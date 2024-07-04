package expo.modules.nearbyconnectionsexpo

import android.Manifest
import expo.modules.kotlin.functions.Coroutine
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.util.Log

class NearbyConnectionsExpoModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NearbyConnectionsExpo")

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      "Hello world! 👋"
    }

    AsyncFunction("requestPermissionsAsync") Coroutine { ->
      val permissionsManager = appContext.permissions ?: throw NoPermissionsModuleException()

      
      // We aren't using the values returned above, because we need to check if the user has provided fine location permissions
      return@Coroutine NearbyConnectionsHelpers.askForPermissionsWithPermissionsManager(permissionsManager, Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION);
    }

    AsyncFunction("getPermissionsAsync") Coroutine { ->
      return@Coroutine getPermissionsAsync()
    }
  }

  private suspend fun getPermissionsAsync(): PermissionRequestResponse {
    appContext.permissions?.let {
      val locationPermission = NearbyConnectionsHelpers.getPermissionsWithPermissionsManager(it, Manifest.permission.ACCESS_COARSE_LOCATION)
      val fineLocationPermission = NearbyConnectionsHelpers.getPermissionsWithPermissionsManager(it, Manifest.permission.ACCESS_FINE_LOCATION)
      var accuracy = "none"
      if (locationPermission.granted) {
        accuracy = "coarse"
      }
      if (fineLocationPermission.granted) {
        accuracy = "fine"
      }

      locationPermission.android = PermissionDetailsLocationAndroid(
        accuracy = accuracy
      )
      return locationPermission
    } ?: throw NoPermissionsModuleException()
  }

}
