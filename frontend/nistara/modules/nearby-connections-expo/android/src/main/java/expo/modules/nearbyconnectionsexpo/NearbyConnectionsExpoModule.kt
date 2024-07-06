package expo.modules.nearbyconnectionsexpo

import android.Manifest
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.functions.Coroutine
import expo.modules.kotlin.functions.AsyncFunction
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.Dispatchers
import android.util.Log
import kotlinx.coroutines.*

class NearbyConnectionsExpoModule : Module() {
  private val coroutineScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
  val context = appContext.reactContext ?: throw CodedException("No React context")
  private val nearbyConnections = NearbyConnections(context, Dispatchers.IO)
  override fun definition() = ModuleDefinition {
    Name("NearbyConnectionsExpo")

    // Defines event names that the module can send to JavaScript.
    Events("onEndpointConnected", "onEndpointLost", "onPayloadReceived")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      "Hello world! 👋"
    }

    AsyncFunction("startAdvertising") Coroutine { ->
      return@Coroutine coroutineScope.launch {
        nearbyConnections.startAdvertising().collect { event -> handleNearbyEvent(event)}
      }
    }

    AsyncFunction("startDiscovery") Coroutine { ->
      // Launch a coroutine to collect the flow and send events to JavaScript
      return@Coroutine coroutineScope.launch {
        nearbyConnections.startDiscovery().collect { event -> handleNearbyEvent(event)}
      }
    }

    AsyncFunction("sendPayload") Coroutine { endpointId: String, bytes: ByteArray ->
      return@Coroutine nearbyConnections.sendPayload(endpointId, bytes)
    }

    AsyncFunction("requestPermissionsAsync") Coroutine { ->
      val permissionsManager = appContext.permissions ?: throw NoPermissionsModuleException()
      NearbyConnectionsHelpers.askForPermissionsWithPermissionsManager(
        permissionsManager,
        Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION,
        Manifest.permission.BLUETOOTH,Manifest.permission.BLUETOOTH_ADMIN,Manifest.permission.BLUETOOTH_SCAN,Manifest.permission.BLUETOOTH_ADVERTISE,Manifest.permission.BLUETOOTH_CONNECT,
        Manifest.permission.ACCESS_WIFI_STATE,Manifest.permission.CHANGE_WIFI_STATE,
        Manifest.permission.NEARBY_WIFI_DEVICES // Only for Tiramisu and after.
        );

      return@Coroutine getPermissionsAsync()
    }

    AsyncFunction("getPermissionsAsync") Coroutine { ->
      return@Coroutine getPermissionsAsync()
    }
  }

  private suspend fun getPermissionsAsync(): Map<String, PermissionRequestResponse> {
    appContext.permissions?.let {
      val coarseLocationPermission = NearbyConnectionsHelpers.getPermissionsWithPermissionsManager(it, Manifest.permission.ACCESS_COARSE_LOCATION)
      val fineLocationPermission = NearbyConnectionsHelpers.getPermissionsWithPermissionsManager(it, Manifest.permission.ACCESS_FINE_LOCATION)
      val bluetoothPermission = NearbyConnectionsHelpers.getPermissionsWithPermissionsManager(it, Manifest.permission.BLUETOOTH)
      val bluetoothAdminPermission = NearbyConnectionsHelpers.getPermissionsWithPermissionsManager(it, Manifest.permission.BLUETOOTH_ADMIN)
      val bluetoothScanPermission = NearbyConnectionsHelpers.getPermissionsWithPermissionsManager(it, Manifest.permission.BLUETOOTH_SCAN)
      val bluetoothAdvertisePermission = NearbyConnectionsHelpers.getPermissionsWithPermissionsManager(it, Manifest.permission.BLUETOOTH_ADVERTISE)
      val bluetoothConnectPermission = NearbyConnectionsHelpers.getPermissionsWithPermissionsManager(it, Manifest.permission.BLUETOOTH_CONNECT)
      val accessWifiStatePermission = NearbyConnectionsHelpers.getPermissionsWithPermissionsManager(it, Manifest.permission.ACCESS_WIFI_STATE)
      val changeWifiStatePermission = NearbyConnectionsHelpers.getPermissionsWithPermissionsManager(it, Manifest.permission.CHANGE_WIFI_STATE)
      val nearbyWifiDevicesPermission = NearbyConnectionsHelpers.getPermissionsWithPermissionsManager(it, Manifest.permission.NEARBY_WIFI_DEVICES)

      return mapOf(
            "coarseLocationPermission" to coarseLocationPermission,
            "fineLocationPermission" to fineLocationPermission,
            "bluetoothPermission" to bluetoothPermission,
            "bluetoothAdminPermission" to bluetoothAdminPermission,
            "bluetoothScanPermission" to bluetoothScanPermission,
            "bluetoothAdvertisePermission" to bluetoothAdvertisePermission,
            "bluetoothConnectPermission" to bluetoothConnectPermission,
            "accessWifiStatePermission" to accessWifiStatePermission,
            "changeWifiStatePermission" to changeWifiStatePermission,
            "nearbyWifiDevicesPermission" to nearbyWifiDevicesPermission
        )
    } ?: throw NoPermissionsModuleException()
  }

  private suspend fun handleNearbyEvent(event: NearbyEvent) {
    when (event) {
      is NearbyEvent.EndpointConnected -> {
        sendEvent("onEndpointConnected", mapOf("endpointId" to event.endpointId))
      }
      is NearbyEvent.EndpointLost -> {
        sendEvent("onEndpointLost", mapOf("endpointId" to event.endpointId))
      }
      is NearbyEvent.PayloadReceived -> {
        sendEvent("onPayloadReceived", mapOf(
          "endpointId" to event.endpointId,
          "payload" to event.payload // You might need to encode the payload to a suitable format
        ))
      }
    }
  }
}
